import { useRouter } from 'expo-router';
import { Button, Text, View } from 'tamagui';

export default function Index() {
  const router = useRouter();

  return (
    <View flex={1} justifyContent="center" alignItems="center" gap="$4">
      <Text fontSize="$6">Welcome to WeOut !</Text>
      <Button onPress={() => router.push('/login')}>Go to Login</Button>
    </View>
  );
}