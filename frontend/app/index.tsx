import { View, Button, Text } from 'tamagui';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View flex={1} justifyContent="center" alignItems="center" gap="$4">
      <Text fontSize="$6">Welcome to WeOut !</Text>
      <Text fontSize="$4">Build : 09/05/2025 10AM</Text>
      <Button onPress={() => router.push('/login')}>Go to Login</Button>
    </View>
  );
}