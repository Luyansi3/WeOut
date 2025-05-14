import { View, Input, Button, Text, Image, XStack, YStack, SizableText, Tabs, Separator, TabsContentProps } from 'tamagui';
import { Instagram, Twitter, Users2, PartyPopper } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { fetchUserFriends, fetchUserProfile } from '@/services/profileService';
import { ActivityIndicator } from 'react-native';
import { UserProfileResponse } from '@/types/UserProfile';
import { EventResponse } from '@/types/Event';
import { fetchEventByUserId } from '@/services/eventService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { setMe } from '@/services/setMeService';
import CustomButton from '@/components/CustomButton';


export default function UserprofileScreen() {
    const router = useRouter();
    let [profilePicturePath, setprofilePicturePath] = useState("");
    let [userPrenom, setuserPrenom] = useState("");
    let [userNom, setuserNom] = useState("");
    let [pseudo, setpseudo] = useState("");
    let [userFriends, setuserFriends] = useState(0);
    let [nombreSoirees, setnombreSoirees] = useState(0);
    let [userBio, setuserBio] = useState("");

    const customColors = {
        background: "#F5F5F7",
        pink: "#FF3C78",
        purple: "#8F00FF",
        textSecond: "#747688",
        textMain: "#1A1B41"
    };


    useAuthRedirect(); // check if there is a token in AsyncStorage otherwise redirect to login
    useEffect(() => {
        (async () => {
            await setMe(router); // set the user in AsyncStorage
            const userString = await AsyncStorage.getItem('user');
            const user_obj = JSON.parse(userString);

            setprofilePicturePath(user_obj.photoProfil);
            setuserPrenom(user_obj.prenom);
            setuserNom(user_obj.nom);
            setpseudo(user_obj.pseudo);
            setuserBio(user_obj.bio);

            await AsyncStorage.removeItem('user');
        })();
    }, []);




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
                    source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${profilePicturePath}` }}
                />


                <YStack
                    width="100%"
                    padding={"$4"}
                    gap="$2"
                    backgroundColor="white"
                >

                    <Text fontSize="$8">{userPrenom} {userNom}</Text>
                    <Text fontSize="$6" marginBottom={"$3"} color="gray">{pseudo}</Text>
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
                            <Text fontSize="$6"> {userFriends} </Text>
                        </XStack>
                        <XStack gap="$2">
                            <PartyPopper
                                width={24}
                                height={24}
                            />
                            <Text fontSize="$6"> {nombreSoirees} </Text>
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
                        {userBio}
                    </Text>

                    <XStack alignContent="center" justifyContent='center'>
                        <CustomButton
                            title="Log out"

                            backgroundColor={customColors.pink}
                            maxWidth={150}
                            minHeight={50}
                            borderRadius={15}
                            fontSize={15}
                            fontFamily={"Raleway-SemiBold"}
                            pressStyle={{ backgroundColor: customColors.pink }}
                            focusStyle={{ backgroundColor: customColors.pink }}
                            hoverStyle={{ backgroundColor: customColors.pink }}
                            onPress={async () => {
                                await AsyncStorage.removeItem('token');
                                await AsyncStorage.removeItem('user'); // optionnel
                                router.replace('/login');
                            }}
                        />
                    </XStack>

                </YStack>

            </YStack>

        </View>
    );
}