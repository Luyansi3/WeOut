// IMPORTS
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text } from 'tamagui';
import {
    ArrowLeft,
    Mail
} from '@tamagui/lucide-icons';

// Custom components:
import CustomInput from '../components/CustomInput';



// GLOBAL VARS
const customColors = {
    background: "#F5F5F7",
    pink: "#FF3C78",
    purple: "#8F00FF",
    textSecond: "#747688",
    textMain: "#1A1B41"
};
const router = useRouter();

export default function ResetPasswordScreen() {
    const [email, setEmail] = useState('');


    return (
        <YStack flex={1} padding={24} backgroundColor={customColors.background}> {/* Pour mettre le sign in a gauche ? */}
            <XStack alignItems="center" marginBottom={8}>
                <Pressable onPress={() => router.back()}>
                    <ArrowLeft size={24} color={customColors.textMain} />
                </Pressable>
            </XStack>



            <YStack width="100%" space={16}>

                <Text fontSize={28} fontFamily={"Raleway-Bold"} marginLeft={8} color={customColors.textMain}>
                    Reset Password
                </Text>

                <Text fontSize={16} fontFamily={"Raleway-Regular"} marginBottom={24} color={customColors.textMain}>
                    Please enter your email address to request a password reset
                </Text>

                <CustomInput value={email}
                    leftIcon={<Mail />}
                    placeholder='Your email'
                    inputType="email"
                    onChangeText={setEmail} />

            </YStack>

        </YStack>
    );
};