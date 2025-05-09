// app/index.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Button } from 'tamagui';
import Header from './components/Header';  // ← chemin corrigé

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header title="Accueil" showBackButton={false} />

      <View style={styles.content}>
        <Button>Welcome!</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
