import { Stack } from "expo-router";
import { TamaguiProvider, createTamagui } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Stack screenOptions={{ headerShown: false }} />
    </TamaguiProvider>
  );
}
