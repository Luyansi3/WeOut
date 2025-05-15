import React, { useEffect, useState } from 'react';
import { XStack, Image, YStack, View, Button, Text } from 'tamagui';
import { Bell } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// services:
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import SlidingSlider from '../SlidingSlider/SlidingSlider';
import { EventResponse } from '@/types/Event';

/**
 * Header component with fixed dimensions and absolute positioning.
 * - Size: width 375, height 101
 * - Positioned at top: absolute positioning
 * - Background color: #FF3C78
 * - White logo of size 40x40 at left
 * - Notification bell in semi-transparent circle left of profile
 * - Profile image in a circle (37.78x37.78) at right
 */
const HeaderWithNote: React.FC<{ event: EventResponse; value: number; setValue: React.Dispatch<React.SetStateAction<number>> }> = ({ event, value, setValue }) => {
  // calculate offsets
  const profileRight = 24;
  const profileSize = 37.78;
  const bellCircleSize = profileSize;

  const router = useRouter();

  // user info:
  let [profilePicturePath, setprofilePicturePath] = useState("");


  useAuthRedirect(); // check if there is a token in AsyncStorage otherwise redirect to login
  useEffect(() => {
    (async () => {
      const userString = await AsyncStorage.getItem('user');
      const user_obj = userString ? JSON.parse(userString): {};
      setprofilePicturePath(user_obj.photoProfil);
    })();
  }, []);





  return (
    <YStack
      width="100%"
      height={"20%"}
      backgroundColor="#FF3C78"
      gap={"5%"}
      >
      <XStack
        width="100%"
        height={"70%"}
        zIndex={1}
        alignItems="flex-end"
        justifyContent="space-between"
        paddingHorizontal={"5%"}
        paddingVertical={"5%"}
      >
        {/* Logo blanc */}
        <Image
          testID='LogoImage'
          source={require('@/assets/images/WeOutLogo.png')}
          alt="Logo"
          width={40}
          height={40}
          resizeMode="contain"
          zIndex={2}
        />

        <XStack
          width="100%"
          height={"100%"}
          alignItems="flex-end"
          justifyContent="flex-end"
          paddingRight={"8%"}
          gap={"2%"}
        >
          {/* Notification bell background */}
          <YStack
            width={bellCircleSize}
            height={bellCircleSize}
            borderRadius={bellCircleSize / 2}
            backgroundColor="rgba(255,255,255,0.1)"
            alignItems="center"
            justifyContent="center"
            zIndex={3}
          >
            {/* Bell icon positioned at center with highest z-index */}
            <Bell testID='BellIcon' width={20} height={20} color="#FFFFFF" />
          </YStack>

          {/* Photo de profil circulaire */}
          <Button
            testID='ProfileButton'
            width={profileSize}
            height={profileSize}
            borderRadius={profileSize / 2}
            backgroundColor="rgba(255,255,255,0.1)"
            alignItems="center"
            justifyContent="center"
            zIndex={3}
            onPress={() => {
              router.push('/userprofile');
            }
            }
          >
            <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${profilePicturePath}` }}

            testID='ProfileImage'
            alt="Profile"
            width={profileSize}
            height={profileSize}
            borderRadius={profileSize / 2}
            resizeMode="cover"
            zIndex={2}
          />
          </Button>
          
        </XStack>
      </XStack>
      <XStack
          width="100%"
          height={"10%"}
          zIndex={1000}
          justifyContent="center"
        >
          <View
            width="80%"
            height={"100%"}
            justifyContent='center'
            alignItems='center'
            gap={"30%"}
          >
            <Text fontFamily={"Raleway-Bold"} fontSize={16} color="white">How is it like at {event.nom}</Text>
            <SlidingSlider value={25} max={100} icon="🔥" gradientFrom='#32FFCE' gradientTo="#32FFCE" onValueChange={setValue}/>
          </View>
        </XStack>
    </YStack>
  );
};

export default HeaderWithNote;
