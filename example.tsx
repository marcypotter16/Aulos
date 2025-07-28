import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Example = {
  str: string,
  id: number
}
export default function Example() {
  const [counter, setCounter] = useState<Example | null>(null);

  const incrementCounter = () => {
    setCounter(() => {
      if (!counter) return null
      else return {
      str: counter.str,
      id: counter.id + 1
    }});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>Counter: {counter?.id}</Text>
      <TouchableOpacity style={styles.button} onPress={incrementCounter}>
        <Text style={styles.buttonText}>Add 1</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});