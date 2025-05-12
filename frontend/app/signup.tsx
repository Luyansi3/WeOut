import React, { useState } from 'react';
import { Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

// Tamagui & Lucide icons (Mail, Lock, Eye, EyeOff, ArrowRight)

// Expo vector icons for social login
import { FontAwesome } from '@expo/vector-icons';
import {
    LockKeyhole,
    Mail,
    TextCursorInput,
    User,
    ArrowRight
} from '@tamagui/lucide-icons';

// Logo asset import (local image)
import { Button, Text, Switch, XStack, YStack } from 'tamagui';

// Custom components
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

// Custom colors:
const customColors = {
    background: "#F5F5F7",
    pink: "#FF3C78",
    purple: "#8F00FF",
    textSecond: "#747688",
    textMain: "#1A1B41"
};

// Router for navigation
const router = useRouter();

const SignupScreen = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    /* 

    FUNCTION FOR REGISTRATION

    */

    const handleSignUp = () => {
        if (!fullName || !username || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fullName, username, email, password }),
            });
            if (!res.ok) throw new Error('Registration failed');
            alert('Registration successful! Please log in.');
            router.push('/login');
          } catch (e) {
            alert('Registration error');
          }
    }


    return (
        <YStack flex={1} padding={24} backgroundColor={customColors.background}> {/* Pour mettre le sign in a gauche ? */}
            <Text fontSize={28} fontFamily={"Raleway-Bold"} marginBottom={8} color={customColors.textMain} >
                Sign up
            </Text>




            <YStack width="100%" space={16}>
                <CustomInput value={fullName}
                    leftIcon={<User />}
                    placeholder='Your fullname'
                    inputType="text"
                    onChangeText={setFullName} />

                <CustomInput value={username}
                    leftIcon={<User />}
                    placeholder='Your username'
                    inputType="text"
                    onChangeText={setUsername} />

                <CustomInput value={email}
                    leftIcon={<Mail />}
                    placeholder='Your mail'
                    inputType="email"
                    onChangeText={setEmail} />

                <CustomInput value={password}
                    leftIcon={<LockKeyhole />}
                    placeholder='Your password'
                    inputType="password"
                    onChangeText={setPassword} />

                <CustomInput value={confirmPassword}
                    leftIcon={<LockKeyhole />}
                    placeholder='Confirm your password'
                    inputType="password"
                    onChangeText={setConfirmPassword} />




                {/* Bouton Sign up */}
                <XStack justifyContent="center" alignItems="center" >
                    <CustomButton
                        backgroundColor={customColors.pink}
                        title="SIGN UP"
                        endIcon={<ArrowRight size={16} color={customColors.textMain} />}
                        minWidth={250}
                        minHeight={60}
                        borderRadius={15}
                        fontSize={15}
                        fontFamily={"Raleway-SemiBold"}

                        endCircle={true}
                        // to do le onPress
                        onPress={() => {
                            console.log('Sign up button pressed');
                        }}
                        pressStyle={{ backgroundColor: customColors.pink }}
                        focusStyle={{ backgroundColor: customColors.pink }}
                        hoverStyle={{ backgroundColor: customColors.pink }}
                    />
                </XStack>





                {/* Le OR et les deux barres */}
                <XStack alignItems="center" justifyContent="center" space={8} marginVertical={16} >
                    <YStack flex={1} height={1} backgroundColor={customColors.textSecond} maxWidth={150} opacity={0.5} />
                    <Text fontSize="$3" color={customColors.textSecond} fontFamily={"Raleway-SemiBold"} >
                        OR
                    </Text>
                    <YStack flex={1} height={1} opacity={0.5} backgroundColor={customColors.textSecond} maxWidth={150} />
                </XStack>




                {/* Google et Facebook */}
                <CustomButton
                    title="Login with Google"
                    startIcon={
                        <FontAwesome name="google" size={20} color={customColors.purple} />
                    }
                    height={52}
                    borderRadius="$6"
                    borderWidth={1}
                    borderColor="#CCC"
                    backgroundColor="#FFF"
                    color="#000"
                    onPress={() => {
                        // TODO: google login
                    }}
                    textColor={customColors.textMain}
                />

                <CustomButton
                    title="Login with Facebook"
                    startIcon={
                        <FontAwesome name="facebook-square" size={20} color={customColors.purple} />
                    }
                    height={52}
                    borderRadius="$6"
                    borderWidth={1}
                    borderColor="#CCC"
                    backgroundColor="#FFF"
                    color="#000"
                    onPress={() => {
                        // TODO: facebook login
                    }}
                    textColor={customColors.textMain}
                />





                <XStack justifyContent="center" alignItems="center" marginTop={24}>
                    <Text fontSize="$3" fontFamily={"Raleway-Regular"} color="#000">Already have an account? </Text>
                    <Pressable onPress={() => { router.push('/login'); }}>
                        <Text fontSize="$3" color={customColors.purple} fontFamily={"Raleway-Regular"} >
                            Sign in
                        </Text>
                    </Pressable>
                </XStack>
            </YStack>
        </YStack>

    );
};

export default SignupScreen;