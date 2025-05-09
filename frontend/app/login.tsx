import { View, Input, Button, Text } from 'tamagui';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View flex={1} justifyContent="center" alignItems="center" gap="$4">
      <Text fontSize="$6">Login</Text>
      <Input placeholder="Username" />
      <Input placeholder="Password" secureTextEntry />
      <Button onPress={() => router.push('/home')}>Login</Button>
    </View>
  );
}
