import ProfileScreenPostCard, { ProfileScreenPost } from '@/components/PostCard/ProfileScreenPostCard';
import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface UserProfile {
  id: string;
  user_name: string;
  name?: string;
  email: string;
  instrument?: string;
  genre?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const UserProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { user_id } = useLocalSearchParams<{ user_id: string }>();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<ProfileScreenPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = getStyles(theme);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!user_id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, user_name, name, email, instrument, genre, bio, avatar_url, created_at')
        .eq('id', user_id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile');
      } else {
        setUserProfile(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!user_id) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          post_media (
            id,
            post_id,
            media_path,
            type,
            position,
            created_at
          )
        `)
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching user posts:', error);
      } else {
        setUserPosts(data || []);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user_id) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [user_id]);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserProfile(), fetchUserPosts()]);
    setRefreshing(false);
  };

  // Handle post deletion (callback from ProfileScreenPostCard)
  const handlePostDeleted = () => {
    fetchUserPosts(); // Refresh posts after deletion
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary} 
        />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Render error state
  if (error || !userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons 
          name="person-circle-outline" 
          size={isTablet ? 120 : 80} 
          color={theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary} 
        />
        <Text style={styles.errorTitle}>Profile not found</Text>
        <Text style={styles.errorSubtitle}>
          {error || 'This user profile could not be loaded'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate join date
  const joinDate = new Date(userProfile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Render profile header
  const renderProfileHeader = () => (
    <View style={styles.headerContainer}>
      {/* Back button */}
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons 
          name="arrow-back" 
          size={isTablet ? 32 : 24} 
          color={theme === 'dark' ? darkThemeColors.text : lightThemeColors.text} 
        />
      </TouchableOpacity>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        {userProfile.avatar_url ? (
          <Image source={{ uri: userProfile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Ionicons 
              name="person" 
              size={isTablet ? 80 : 60} 
              color={theme === 'dark' ? darkThemeColors.text : lightThemeColors.text} 
            />
          </View>
        )}
      </View>

      {/* User info */}
      <View style={styles.userInfo}>
        <Text style={styles.displayName}>
          {userProfile.name || userProfile.user_name}
        </Text>
        <Text style={styles.username}>@{userProfile.user_name}</Text>
        
        {userProfile.bio && (
          <Text style={styles.bio}>{userProfile.bio}</Text>
        )}

        {/* User details */}
        <View style={styles.detailsContainer}>
          {userProfile.instrument && (
            <View style={styles.detailItem}>
              <Ionicons 
                name="musical-notes" 
                size={isTablet ? 20 : 16} 
                color={theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary}
              />
              <Text style={styles.detailText}>{userProfile.instrument}</Text>
            </View>
          )}
          
          {userProfile.genre && (
            <View style={styles.detailItem}>
              <Ionicons 
                name="disc" 
                size={isTablet ? 20 : 16} 
                color={theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary}
              />
              <Text style={styles.detailText}>{userProfile.genre}</Text>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <Ionicons 
              name="calendar" 
              size={isTablet ? 20 : 16} 
              color={theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary}
            />
            <Text style={styles.detailText}>Joined {joinDate}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Render posts section
  const renderPostsSection = () => (
    <View style={styles.postsSection}>
      <Text style={styles.sectionTitle}>Posts</Text>
      
      {postsLoading ? (
        <View style={styles.postsLoadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary} 
          />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      ) : userPosts.length === 0 ? (
        <View style={styles.emptyPostsContainer}>
          <Ionicons 
            name="musical-notes-outline" 
            size={isTablet ? 80 : 60} 
            color={theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary} 
          />
          <Text style={styles.emptyPostsTitle}>No posts yet</Text>
          <Text style={styles.emptyPostsSubtitle}>
            {userProfile.name || userProfile.user_name} hasn't shared any posts yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          numColumns={Platform.OS === 'web' ? 3 : isTablet ? 3 : 1} // 3 cols on web/tablet, 1 on phone
          renderItem={({ item }) => (
            <ProfileScreenPostCard 
              post={item} 
              onPostDeleted={handlePostDeleted}
            />
          )}
          contentContainerStyle={styles.postsGrid}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Let parent ScrollView handle scrolling
        />
      )}
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary]}
          tintColor={theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary}
        />
      }
    >
      {renderProfileHeader()}
      {renderPostsSection()}
    </ScrollView>
  );
};

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? darkThemeColors.background : lightThemeColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? darkThemeColors.background : lightThemeColors.background,
  },
  loadingText: {
    marginTop: isTablet ? 16 : 12,
    fontSize: isTablet ? 18 : 16,
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 40 : 20,
    backgroundColor: theme === 'dark' ? darkThemeColors.background : lightThemeColors.background,
  },
  errorTitle: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    marginTop: isTablet ? 24 : 16,
    marginBottom: isTablet ? 12 : 8,
  },
  errorSubtitle: {
    fontSize: isTablet ? 18 : 16,
    color: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
    textAlign: 'center',
    marginBottom: isTablet ? 32 : 24,
  },
  backButton: {
    backgroundColor: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
    paddingHorizontal: isTablet ? 32 : 24,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: isTablet ? 12 : 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  },
  headerContainer: {
    paddingTop: isTablet ? 20 : 16,
    paddingBottom: isTablet ? 32 : 24,
    paddingHorizontal: isTablet ? 24 : 16,
  },
  backIcon: {
    alignSelf: 'flex-start',
    padding: isTablet ? 12 : 8,
    marginBottom: isTablet ? 20 : 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: isTablet ? 24 : 16,
  },
  avatar: {
    width: isTablet ? 140 : 120,
    height: isTablet ? 140 : 120,
    borderRadius: isTablet ? 70 : 60,
  },
  defaultAvatar: {
    width: isTablet ? 140 : 120,
    height: isTablet ? 140 : 120,
    borderRadius: isTablet ? 70 : 60,
    backgroundColor: theme === 'dark' ? darkThemeColors.surface : lightThemeColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
  },
  userInfo: {
    alignItems: 'center',
  },
  displayName: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: 'bold',
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    marginBottom: isTablet ? 8 : 4,
  },
  username: {
    fontSize: isTablet ? 20 : 18,
    color: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
    marginBottom: isTablet ? 16 : 12,
  },
  bio: {
    fontSize: isTablet ? 18 : 16,
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 22,
    marginBottom: isTablet ? 20 : 16,
    paddingHorizontal: isTablet ? 20 : 0,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: isTablet ? 24 : 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 12 : 8,
  },
  detailText: {
    fontSize: isTablet ? 16 : 14,
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    marginLeft: isTablet ? 12 : 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: isTablet ? 24 : 16,
  },
  statNumber: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
  },
  statLabel: {
    fontSize: isTablet ? 16 : 14,
    color: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
    marginTop: isTablet ? 4 : 2,
  },
  postsSection: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingBottom: isTablet ? 32 : 24,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    marginBottom: isTablet ? 20 : 16,
  },
  postsLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 40 : 32,
  },
  emptyPostsContainer: {
    alignItems: 'center',
    paddingVertical: isTablet ? 60 : 40,
  },
  emptyPostsTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    marginTop: isTablet ? 20 : 16,
    marginBottom: isTablet ? 8 : 4,
  },
  emptyPostsSubtitle: {
    fontSize: isTablet ? 16 : 14,
    color: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
    textAlign: 'center',
  },
  postsGrid: {
    paddingBottom: isTablet ? 20 : 16,
  },
});

export default UserProfileScreen;