import { View, Input, Button, Text } from 'tamagui';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <View flex={1} justifyContent="center" alignItems="center" gap="$4">
            <Text fontSize="$6">Login</Text>
            <Input placeholder="Username" />
            <Input placeholder="Password" secureTextEntry />
            <Button color="white" backgroundColor="#FF3C78"  onPress={() => router.push('/index')}>Login</Button>
            <Text fontSize="$4">
                Don't have an account?{' '}
                <Text 
                    fontSize="$4" 
                    color="#FF3C78" 
                    onPress={() => router.push('/signup')}
                >
                    Sign Up
                </Text>
            </Text>
        </View>
    );
}
