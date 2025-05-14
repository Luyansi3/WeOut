// app/(tabs)/_layout.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import { Tabs } from 'expo-router';
import { createTamagui, TamaguiProvider, View } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import NavigationBar from '@/components/NavBar/NavBar';

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={props => <NavigationBar {...props} />}
          >
            <Tabs.Screen name="index"  options={{ title: 'Home' }} />
            <Tabs.Screen name="map"    options={{ title: 'Map'  }} />
            <Tabs.Screen name="search" options={{ title: 'Search' }} />
          </Tabs>
        </View>
      </SafeAreaView>
    </TamaguiProvider>
  );
}