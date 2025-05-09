import React, { useState } from 'react';
import { Image, Pressable } from 'react-native';

// Tamagui & Lucide icons (Mail, Lock, Eye, EyeOff, ArrowRight)

// Expo vector icons for social login
import { FontAwesome } from '@expo/vector-icons';
import { ArrowRight } from '@tamagui/lucide-icons';

// Logo asset import (local image)
import { Button, Switch, Text, XStack, YStack } from 'tamagui';

// Custom components
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';



const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Custom colors:
  const customColors = {
    background: "#F5F5F7",
    pink: "#FF3C78",
    purple: "#8F00FF",
    textSecond: "#747688",
    textMain: "#1A1B41"
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

        {/* Email et Password */}
        <CustomInput inputType="email" />
        <CustomInput inputType="password" />




        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" space={8}>
            <Switch
              checked={remember}
              onCheckedChange={setRemember}
              size="$3"
              backgroundColor={remember ? customColors.purple : "#E5E5E5"}
            >
              <XStack alignItems="center"  padding={2}>
                <Switch.Thumb alignContent="center" animation="quick" backgroundColor="white" size="$2" />
              </XStack>
            </Switch>
            <Text fontSize="$3" color={customColors.textMain}>Remember Me</Text>
          </XStack>

          <Pressable onPress={() => {/* TODO: forgot password */ }}>
            <Text fontSize="$3" color={customColors.purple}>
              Forgot Password?
            </Text>
          </Pressable>
        </XStack>


        {/* Bouton Sign in */}
        <XStack justifyContent="center" alignItems="center" >
          <CustomButton
            backgroundColor={customColors.pink}
            title="SIGN IN"
            endIcon={<ArrowRight size={16} color={customColors.textMain} />}
            minWidth={250}
            minHeight={60}
            borderRadius={15}
            fontSize={15}
            fontFamily={"Raleway-SemiBold"}
    
            endCircle={true}
            // to do le onPress
            onPress={() => {
              console.log('Sign in button pressed');
            }}
            pressStyle={{ backgroundColor: customColors.pink }}
            focusStyle={{ backgroundColor: customColors.pink }}
            hoverStyle={{ backgroundColor: customColors.pink }}
          />
        </XStack>





        {/* Le OR et les deux barres */}
        <XStack alignItems="center" justifyContent="center" space={8} marginVertical={16} >
          <YStack flex={1} height={1} backgroundColor={customColors.textSecond} maxWidth={150} opacity={0.5} />
          <Text fontSize="$3" color={customColors.textSecond} fontWeight={"200"}>
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
          <Text fontSize="$3" color="#000">Don’t have an account yet? </Text>
          <Pressable onPress={() => {/* TODO: go to SignUp */ }}>
            <Text fontSize="$3" color={customColors.purple}>
              Sign up
            </Text>
          </Pressable>
        </XStack>
      </YStack>
    </YStack>

  );
};

export default SignInScreen;
