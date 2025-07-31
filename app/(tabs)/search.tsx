import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SearchUser {
  id: string;
  user_name: string;
  name?: string;
  instrument?: string;
  genre?: string;
  avatar_url?: string;
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const SearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const styles = getStyles(theme);

  // Debounced search function
  const handleSearch = (text: string) => {
    setQuery(text);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      performSearch(text.trim());
    }, 300); // 300ms delay

    setSearchTimeout(timeout);
  };

  const performSearch = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, user_name, name, instrument, genre, avatar_url')
        .or(`user_name.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,instrument.ilike.%${searchTerm}%,genre.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) {
        console.error('Search error:', error);
        setResults([]);
      } else {
        setResults(data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const renderUserItem = ({ item }: { item: SearchUser }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => router.push(`/user_profile?user_id=${item.id}`)}
    >
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          {item.avatar_url ? (
            <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Ionicons 
                name="person" 
                size={isTablet ? 28 : 24} 
                color={theme === 'dark' ? darkThemeColors.text : lightThemeColors.text} 
              />
            </View>
          )}
        </View>
        
        <View style={styles.userDetails}>
          <Text style={styles.userName}>@{item.user_name}</Text>
          {item.name && <Text style={styles.displayName}>{item.name}</Text>}
          <View style={styles.metaContainer}>
            {item.instrument && (
              <Text style={styles.metaText}>🎵 {item.instrument}</Text>
            )}
            {item.genre && (
              <Text style={styles.metaText}>🎼 {item.genre}</Text>
            )}
          </View>
        </View>
      </View>
      
      <Ionicons 
        name="chevron-forward" 
        size={isTablet ? 24 : 20} 
        color={theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary} 
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (loading) return null;
    
    if (query.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons 
            name="search" 
            size={isTablet ? 80 : 64} 
            color={theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary} 
          />
          <Text style={styles.emptyTitle}>Search for musicians</Text>
          <Text style={styles.emptySubtitle}>
            Find users by username, name, instrument, or genre
          </Text>
        </View>
      );
    }
    
    if (results.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons 
            name="search" 
            size={isTablet ? 80 : 64} 
            color={theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary} 
          />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try searching for a different term
          </Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons 
            name="search" 
            size={isTablet ? 24 : 20} 
            color={theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search musicians..."
            placeholderTextColor={theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary}
            value={query}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons 
                name="close-circle" 
                size={isTablet ? 24 : 20} 
                color={theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size={isTablet ? "large" : "small"} 
            color={theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary} 
          />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? darkThemeColors.background : lightThemeColors.background,
  },
  header: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingTop: isTablet ? 20 : 16,
    paddingBottom: isTablet ? 16 : 12,
  },
  title: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: 'bold',
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
  },
  searchContainer: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingBottom: isTablet ? 20 : 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? darkThemeColors.surface : lightThemeColors.surface,
    borderRadius: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 16 : 12,
    borderWidth: 1,
    borderColor: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
  },
  searchIcon: {
    marginRight: isTablet ? 12 : 8,
  },
  searchInput: {
    flex: 1,
    height: isTablet ? 56 : 48,
    fontSize: isTablet ? 18 : 16,
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
  },
  clearButton: {
    padding: isTablet ? 8 : 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 24 : 16,
  },
  loadingText: {
    marginLeft: isTablet ? 12 : 8,
    fontSize: isTablet ? 16 : 14,
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
  },
  listContainer: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingBottom: isTablet ? 24 : 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 20 : 16,
    backgroundColor: theme === 'dark' ? darkThemeColors.surface : lightThemeColors.surface,
    borderRadius: isTablet ? 16 : 12,
    marginBottom: isTablet ? 12 : 8,
    shadowColor: '#000',
    shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: isTablet ? 16 : 12,
  },
  avatar: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
  },
  defaultAvatar: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
    backgroundColor: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    marginBottom: isTablet ? 4 : 2,
  },
  displayName: {
    fontSize: isTablet ? 16 : 14,
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    marginBottom: isTablet ? 6 : 4,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isTablet ? 12 : 8,
  },
  metaText: {
    fontSize: isTablet ? 14 : 12,
    color: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 80 : 60,
    paddingHorizontal: isTablet ? 32 : 24,
  },
  emptyTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    marginTop: isTablet ? 24 : 16,
    marginBottom: isTablet ? 12 : 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: isTablet ? 16 : 14,
    color: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
  },
});

export default SearchScreen;