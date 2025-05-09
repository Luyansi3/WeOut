import React from 'react';
import { XStack, Image, YStack, View } from 'tamagui';
import { Bell } from '@tamagui/lucide-icons';

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

  return (
    <View
      width="100%"
      height={120}>
      <XStack
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height={120}
        backgroundColor="#FF3C78"
        zIndex={1}
      >
        {/* Logo blanc */}
        <Image
          source={require('@/assets/images/WeOutLogo.png')}
          alt="Logo"
          position="absolute"
          left={24}
          bottom={16}
          width={40}
          height={40}
          resizeMode="contain"
          zIndex={2}
        />

        {/* Notification bell background */}
        <YStack
          position="absolute"
          right={bellRight}
          bottom={16}
          width={bellCircleSize}
          height={bellCircleSize}
          borderRadius={bellCircleSize / 2}
          backgroundColor="rgba(255,255,255,0.1)"
          alignItems="center"
          justifyContent="center"
          zIndex={3}
        >
          {/* Bell icon positioned at center with highest z-index */}
          <Bell width={20} height={20} color="#FFFFFF" />
        </YStack>

        {/* Photo de profil circulaire */}
        <Image
          source={require('../assets/profile_pictures/hamza_wirane.png')}
          alt="Profile"
          position="absolute"
          right={profileRight}
          bottom={16}
          width={profileSize}
          height={profileSize}
          borderRadius={profileSize / 2}
          resizeMode="cover"
          zIndex={2}
        />
      </XStack>
    </View>
  );
};

export default Header;
