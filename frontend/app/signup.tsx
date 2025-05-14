import React, { useState } from 'react';
import { Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';


// Expo vector icons for social login
import { FontAwesome } from '@expo/vector-icons';
import {
    LockKeyhole,
    Mail,
    ArrowLeft,
    User,
    ArrowRight,
    AtSign,
} from '@tamagui/lucide-icons';

// Logo asset import (local image)
import { Button, Text, Switch, XStack, YStack } from 'tamagui';

// Custom components
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

// Services:
import { signUpUser } from '../services/signingUpService';









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


    const handleSignUp = async () => {
        // Check if all fields are filled
        if (!fullName || !username || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        // Check if password and confirm password match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // Retrieve the first and last name from the full name
        let firstName: string;
        let lastName: string;
        firstName = fullName.split(' ')[0];
        lastName = fullName.split(' ').slice(1).join(' '); // prendre le reste de la liste à partir de 1

        // Check if the first name and last name are not empty
        if (!firstName || !lastName) {
            alert('Please enter a valid full name');
            return;
        }


            await signUpUser(firstName, lastName, username, email, password, router);
    };





    return (
        <YStack flex={1} padding={24} backgroundColor={customColors.background}>
            <XStack alignItems="center" marginBottom={8}>
                <Pressable onPress={() => router.back()}>
                    <ArrowLeft size={24} color={customColors.textMain} />
                </Pressable>
                <Text fontSize={28} fontFamily={"Raleway-Bold"} marginLeft={8} color={customColors.textMain}>
                    Sign Up
                </Text>
            </XStack>




            <YStack width="100%" space={16}>
                <CustomInput value={fullName}
                    leftIcon={<User />}
                    placeholder='Your full name'
                    inputType="text"
                    onChangeText={setFullName} />

                <CustomInput value={username}
                    leftIcon={<AtSign />}
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
                        onPress={handleSignUp}
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