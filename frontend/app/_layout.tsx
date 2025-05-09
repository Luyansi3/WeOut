import { defaultConfig } from '@tamagui/config/v4'; // for quick config install this
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native';
import { createTamagui, TamaguiProvider, View } from 'tamagui';

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaView>
    </TamaguiProvider>
  )
}
