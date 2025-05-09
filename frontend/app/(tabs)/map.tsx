import { View, Text } from 'tamagui';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <View flex={1} justifyContent="center" alignItems="center" gap="$4">
            <Text fontSize="$6">Map</Text>
        </View>
    );
}
