import { Stack } from "expo-router";
import { createTamagui,TamaguiProvider, View } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4' // for quick config install this
import { SafeAreaView } from 'react-native';

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
  );
}
