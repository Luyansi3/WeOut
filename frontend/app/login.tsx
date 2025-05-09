import React, { useState } from 'react';
import { Image, Pressable } from 'react-native';

// Tamagui & Lucide icons (Mail, Lock, Eye, EyeOff, ArrowRight)
import { ArrowRight } from '@tamagui/lucide-icons';

// Expo vector icons for social login
import { FontAwesome } from '@expo/vector-icons';

// Logo asset import (local image)
import { Button, Switch, Text, XStack, YStack } from 'tamagui';

// Custom components
import CustomInput from '../components/customInput';



const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Custom colors:
  const customColors = {
    background : "#F5F5F7",
    pink : "#FF3C78",
    purple : "#8F00FF",
    textSecond : "#747688",
    textMain : "#1A1B41"
  };



  return (

    <YStack flex={1} justifyContent="center" alignItems="center" padding={20} backgroundColor={customColors.background}>
      {/* App logo using local asset */}
      <Image
        source={require('../assets/images/we-out-logo-pink.png')}
        style={{ width: 120, height: 120, marginBottom: 24, resizeMode: 'contain' }}
      />

      <Text fontSize={28} fontWeight="700" marginBottom={24} color={customColors.textMain}>
        Sign in
      </Text>

      <YStack width="100%" space={16}>
        <CustomInput inputType="email" />
        <CustomInput inputType="password" />

        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" space={8}>
            <Switch checked={remember} onCheckedChange={setRemember} size="$4" />
            <Text fontSize="$3" color="#000">Remember Me</Text>
          </XStack>

          <Pressable onPress={() => {/* TODO: forgot password */}}>
            <Text fontSize="$3" color="#3B82F6">
              Forgot Password?
            </Text>
          </Pressable>
        </XStack>

        <Button
          onPress={() => {/* TODO: sign in */}}
          size="$5"
          borderRadius="$6"
          alignItems="center"
          height={52}
          backgroundColor="#FF4C70"
        >
          <XStack flex={1} alignItems="center" justifyContent="center" space={8}>
            <Text fontSize="$4" fontWeight="700" color="#FFF">
              SIGN IN
            </Text>
            <ArrowRight size={20} color="#FFF" />
          </XStack>
        </Button>

        <XStack alignItems="center" justifyContent="center" space={8} marginVertical={16}>
          <YStack flex={1} height={1} backgroundColor="#CCC" />
          <Text fontSize="$3" color="#888">
            OR
          </Text>
          <YStack flex={1} height={1} backgroundColor="#CCC" />
        </XStack>

        <Button
          onPress={() => {/* TODO: google login */}}
          size="$5"
          borderRadius="$6"
          borderWidth={1}
          borderColor="#CCC"
          backgroundColor="#FFF"
          height={52}
        >
          <XStack alignItems="center" space={8}>
            <FontAwesome name="google" size={20} color={customColors.purple} />
            <Text fontSize="$4" fontWeight="500" color="#000">
              Login with Google
            </Text>
          </XStack>
        </Button>

        <Button
          onPress={() => {/* TODO: facebook login */}}
          size="$5"
          borderRadius="$6"
          borderWidth={1}
          borderColor="#CCC"
          backgroundColor="#FFF"
          height={52}
        >
          <XStack alignItems="center" space={8}>
            <FontAwesome name="facebook-square" size={20} color={customColors.purple} />
            <Text fontSize="$4" fontWeight="500" color="#000">
              Login with Facebook
            </Text>
          </XStack>
        </Button>

        <XStack justifyContent="center" alignItems="center" marginTop={24}>
          <Text fontSize="$3" color="#000">Don’t have an account yet? </Text>
          <Pressable onPress={() => {/* TODO: go to SignUp */}}>
            <Text fontSize="$3" color="#3B82F6">
              Sign up
            </Text>
          </Pressable>
        </XStack>
      </YStack>
    </YStack>
    
  );
};

export default SignInScreen;
