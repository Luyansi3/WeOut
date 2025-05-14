// app/userprofile/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, Image, XStack, YStack } from 'tamagui';
import { Instagram, Twitter, Users2, PartyPopper } from '@tamagui/lucide-icons';
import { fetchUserProfile, fetchUserFriends } from '@/services/profileService';
import { UserProfileResponse } from '@/types/UserProfile';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await fetchUserProfile(id);
        setProfile(data);

        const friends = await fetchUserFriends(id);
        setFriendsCount(friends.length);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }
  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${profile.photoProfil}` }}
        style={{ width: 200, height: 200, borderRadius: 100, marginTop: 20 }}
      />
      <Text fontSize={30} mt={10}>
        {profile.prenom} {profile.nom}
      </Text>
      <Text fontSize={18} color="gray">
        @{profile.pseudo}
      </Text>

      <XStack mt={16} space="$4">
        <XStack space="$2" alignItems="center">
          <Users2 size={24} />
          <Text fontSize={16}>{friendsCount} friends</Text>
        </XStack>
        <XStack space="$2" alignItems="center">
          <PartyPopper size={24} />
          <Text fontSize={16}>{profile.nombreSoiree} parties</Text>
        </XStack>
      </XStack>

      <XStack mt={16} space="$4" alignItems="center">
        <XStack space="$2" alignItems="center">
          <Instagram size={24} />
          <Text>Instagram</Text>
        </XStack>
        <XStack space="$2" alignItems="center">
          <Twitter size={24} />
          <Text>Twitter</Text>
        </XStack>
      </XStack>

      <Text mt={20} mx="$4" fontSize={16} color="gray">
        {profile.bio}
      </Text>
    </View>
  );
}
