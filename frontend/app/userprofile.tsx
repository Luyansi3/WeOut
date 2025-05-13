import { View, Input, Button, Text, Image, XStack, YStack, SizableText, Tabs, Separator, TabsContentProps } from 'tamagui';
import { Instagram, Twitter, Users2, PartyPopper } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { fetchUserFriends, fetchUserProfile } from '@/services/profileService';
import { ActivityIndicator } from 'react-native';
import { UserProfileResponse } from '@/types/UserProfile';
import { EventResponse } from '@/types/Event';
import { fetchEventByUserId } from '@/services/eventService';

export default function UserprofileScreen() {
    const router = useRouter();``
    const userId = "008e59b7-329f-4779-bc9e-f4eca8e17222"; 
    const [userProfile, setUserProfile] = useState({} as UserProfileResponse);
    const [userFriends, setUserFriends] = useState([] as UserProfileResponse[]);
    const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            const fetchUser = async () => {
                try {
                const userData: UserProfileResponse = await fetchUserProfile(userId);
                setUserProfile(userData);

                const friendsData: UserProfileResponse[] = await fetchUserFriends(userId)
                setUserFriends(friendsData);

                } catch (err) {
                console.log("Error fetching user:", err);
                } finally {
                setLoading(false);
                }
            };
    
            fetchUser();
        }, []);
    
        if (loading) return <ActivityIndicator size="large" />;



    return (
        <View flex={1}
            backgroundColor={"white"}
            alignContent='center'
            alignItems='center'
        >
            <YStack
                width="100%"
            >
                <Image
                    style={{ width: '100%', height: 282, alignSelf: 'center' }}
                    source={require('../assets/profile_pictures/hamza_wirane.png')}
                />

                <YStack
                    width="100%"
                    padding={"$4"}
                    gap="$2"
                    backgroundColor="white"
                >
                    <Text fontSize="$8">{userProfile.prenom} {userProfile.nom}</Text>
                    <Text fontSize="$6" marginBottom={"$3"} color="gray">{userProfile.compte}</Text>
                    <XStack
                        gap="$4"
                    >
                        <XStack
                            gap="$2"
                        >
                            <Users2
                                width={24}
                                height={24}
                            />
                            <Text fontSize="$6"> {userFriends ? userFriends.length : "0 (Error)"} </Text>
                        </XStack>
                        <XStack gap="$2">
                            <PartyPopper
                                width={24}
                                height={24}
                            />
                            <Text fontSize="$6"> {userProfile.nombreSoiree} </Text>
                        </XStack>
                    </XStack>
                    <XStack
                        gap="$4"
                        marginBottom={"$3"} 
                    >
                        <XStack
                            gap="$2"
                        >
                            <Instagram
                                width={24}
                                height={24}
                            />
                            <Text fontSize="$6">Instagram</Text>
                        </XStack>

                        <XStack
                            gap="$2"
                        >
                            <Twitter
                                width={24}
                                height={24}
                            />
                            <Text fontSize="$6">X</Text>
                        </XStack>



                    </XStack>
                    <Text
                        marginBottom="$2"
                        fontSize="$6"
                        color="gray"
                    >
                        Toujours partant pour de nouvelles vibes vraiment la grosse ambiance ici ou quoiiiiii 100 caractères
                    </Text>

                </YStack>
            </YStack>

        </View>
    );
}