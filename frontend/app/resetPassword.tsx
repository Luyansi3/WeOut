// IMPORTS
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text } from 'tamagui';
import {
    ArrowLeft,
    Mail,
    ArrowRight,
} from '@tamagui/lucide-icons';

// Custom components:
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';



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

            <Pressable onPress={() => router.back()}>
                <ArrowLeft size={24} color={customColors.textMain} />
            </Pressable>




            <Text marginTop={10} fontSize={28} fontFamily={"Raleway-Bold"} color={customColors.textMain}>
                Reset Password
            </Text>

            <Text marginTop={10} fontSize={16} paddingRight={70} fontFamily={"Raleway-Regular"} marginBottom={10} color={customColors.textMain}>
                Please enter your email address to request a password reset
            </Text>


            <CustomInput value={email}
                leftIcon={<Mail />}
                placeholder='Your email'
                inputType="email"
                onChangeText={setEmail} />


            <XStack justifyContent="center" alignItems="center" marginTop={10} >

                <CustomButton
                    title="Send"
                    endCircle={true}
                    fontFamily="Raleway-SemiBold"
                    onPress={() => { console.log("Send button press");/* TO DO*/ }}
                    backgroundColor={customColors.pink}
                    endIcon={<ArrowRight size={15} />}
                    minWidth={150}
                    minHeight={50}
                    borderRadius={20}
                    pressStyle={{ backgroundColor: customColors.pink }}
                    focusStyle={{ backgroundColor: customColors.pink }}
                    hoverStyle={{ backgroundColor: customColors.pink }}

                />

            </XStack>






        </YStack>
    );
};