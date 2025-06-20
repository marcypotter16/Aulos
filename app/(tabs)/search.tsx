import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

interface User {
  id: number;
  name: string;
  instrument: string;
  genre: string;
}

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/search/users?q=${encodeURIComponent(text)}`);
      const data = await response.json();
      console.log('Search results:', data);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search musicians..."
        value={query}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.result}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.instrument} · {item.genre}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loader: { marginTop: 20 },
  result: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  meta: { fontSize: 14, color: '#666' },
});

export default SearchScreen;
