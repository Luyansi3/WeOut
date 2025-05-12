import { defaultConfig } from '@tamagui/config/v4'; // for quick config install this
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native';
import { createTamagui, TamaguiProvider, View } from 'tamagui';

// fonts: see https://docs.expo.dev/develop/user-interface/fonts/ YOU NEED npx expo install expo-font expo-splash-screen
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';


import NavigationBar from "@/components/NavBar/NavBar";

const config = createTamagui(defaultConfig)

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  
  // Loading custom fonts
  const [loaded, error] = useFonts({
    'Raleway-Regular': require('../assets/fonts/Raleway-Regular.ttf'),
    'Raleway-Bold': require('../assets/fonts/Raleway-Bold.ttf'),
    'Raleway-Medium': require('../assets/fonts/Raleway-Medium.ttf'),
    'Raleway-Light': require('../assets/fonts/Raleway-Light.ttf'),
    'Raleway-Black': require('../assets/fonts/Raleway-Black.ttf'),
    'Raleway-SemiBold': require('../assets/fonts/Raleway-SemiBold.ttf'),
    // add more variants as needed
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}/>
        </View>
      </SafeAreaView>
    </TamaguiProvider>
  )
}