import { Tabs } from "expo-router";
import { createTamagui,TamaguiProvider, View } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4' // for quick config install this
import { SafeAreaView } from 'react-native';
import NavigationBar from "@/components/NavBar";

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1}}>
          <Tabs screenOptions={{ headerShown: false }} tabBar={props => <NavigationBar {...props}/>}>
            <Tabs.Screen name="index" options={{ title: 'home' }} />
            <Tabs.Screen name="map" options={{ title: 'map' }} />
            <Tabs.Screen name="post" options={{ title: 'post' }} />
          </Tabs>
        </View>
      </SafeAreaView>
    </TamaguiProvider>
  );
}
