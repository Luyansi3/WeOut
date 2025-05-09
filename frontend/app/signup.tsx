import { View, Input, Button, Text } from 'tamagui';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
    const router = useRouter();

    return (
        <View flex={1} justifyContent="center" alignItems="center" gap="$4">
            <Text fontSize="$6">Sign Up</Text>
            <Input placeholder="Full name" />
            <Input placeholder="Username" />
            <Input placeholder="Email" />
            <Input placeholder="Password" secureTextEntry />
            <Input placeholder="Confirm Password" secureTextEntry />
            <Button color="white" backgroundColor="#FF3C78" onPress={() => router.push('/login')}>Sign Up</Button>
            <Text fontSize="$4">
                Already have an account?{' '}
                <Text 
                    fontSize="$4" 
                    color="#FF3C78" 
                    onPress={() => router.push('/login')}
                >
                    Login
                </Text>
            </Text>
        </View>
    );
}
