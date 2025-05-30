import React, { useEffect, useState } from 'react';
import { XStack, Image, YStack, View, Button } from 'tamagui';
import { Bell } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// services:
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

/**
 * Header component with fixed dimensions and absolute positioning.
 * - Size: width 375, height 101
 * - Positioned at top: absolute positioning
 * - Background color: #FF3C78
 * - White logo of size 40x40 at left
 * - Notification bell in semi-transparent circle left of profile
 * - Profile image in a circle (37.78x37.78) at right
 */
const Header: React.FC = () => {
  // calculate offsets
  const profileRight = 24;
  const profileSize = 37.78;
  const gap = 10;
  const bellCircleSize = profileSize;
  const bellRight = profileRight + profileSize + gap;

  const router = useRouter();

  // user info:
  let [profilePicturePath, setprofilePicturePath] = useState("");


  useAuthRedirect(); // check if there is a token in AsyncStorage otherwise redirect to login
  useEffect(() => {
    (async () => {
      const userString = await AsyncStorage.getItem('user');
      const user_obj = JSON.parse(userString);
      setprofilePicturePath(user_obj.photoProfil);
    })();
  }, []);





  return (
    <View
      width="100%"
      height={"13%"}>
      <XStack
        width="100%"
        height={"100%"}
        backgroundColor="#FF3C78"
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
    </View>
  );
};

export default Header;
