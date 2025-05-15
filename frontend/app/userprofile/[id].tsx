import { View, Input, Button, Text, Image, XStack, YStack, SizableText, Tabs, Separator, TabsContentProps, ScrollView } from 'tamagui';
import { Instagram, Twitter, Globe, Users2, PartyPopper } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { setMe } from '@/services/setMeService';
import CustomButton from '@/components/CustomButton';

import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from '@tamagui/lucide-icons';;


export default function UserprofileScreen() {
    const router = useRouter();
    let [profilePicturePath, setprofilePicturePath] = useState("");
    let [userPrenom, setuserPrenom] = useState("");
    let [userNom, setuserNom] = useState("");
    let [pseudo, setpseudo] = useState("");
    let [userFriends, setuserFriends] = useState(0);
    let [nombreSoirees, setnombreSoirees] = useState(0);
    let [userBio, setuserBio] = useState("");


    let [selectedTab, setSelectedTab] = useState<'Past' | 'Upcoming'>('Upcoming');

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
            setuserFriends(user_obj.nombreAmis);
            setnombreSoirees(user_obj.nombreSoiree);
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
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        position: 'absolute',
                        top: 50, // ajuste selon la plateforme
                        left: 20,
                        zIndex: 10,

                    }}

                >
                    {<ArrowLeft color="white" />}
                </TouchableOpacity>
                <View style={{ width: '100%', height: "40%", position: 'relative' }}>
                    <Image
                        style={{ width: '100%', height: '100%' }}
                        source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${profilePicturePath}` }}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'white']}
                        locations={[0.6, 1]}
                        start={{ x: 0.5, y: 0.3 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    />
                </View>


                <YStack
                    width="100%"
                    padding={"$4"}
                    gap="$2"
                    backgroundColor="white"
                >

                    <Text fontSize="$8" fontFamily={"Raleway-Bold"} color={customColors.textMain}>{userPrenom} {userNom}</Text>
                    <Text fontSize="$6" marginBottom={"$3"} fontFamily={"Raleway-Regular"} color={customColors.textSecond}> {"@"} {pseudo}</Text>
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
                            <Text fontSize="$6" fontFamily={"Raleway-SemiBold"} color={customColors.textMain}>{userFriends}</Text>
                        </XStack>
                        <XStack gap="$2">
                            <PartyPopper
                                width={24}
                                height={24}
                            />
                            <Text fontSize="$6" fontFamily={"Raleway-SemiBold"} color={customColors.textMain}> {nombreSoirees} </Text>
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
                                color={customColors.pink}
                            />
                            <Text color={customColors.pink} fontSize="$6">Instagram</Text>
                        </XStack>

                        <XStack
                            gap="$2"
                        >
                            <Twitter
                                color={customColors.pink}
                                width={24}
                                height={24}
                            />
                            <Text color={customColors.pink} fontSize="$6">Twitter</Text>
                        </XStack>

                        <XStack
                            gap="$2"
                        >
                            <Globe
                                color={customColors.pink}
                                width={24}
                                height={24}
                            />
                            <Text color={customColors.pink} fontSize="$6">Website</Text>
                        </XStack>



                    </XStack>
                    <Text
                        marginBottom="$2"
                        fontSize="$6"
                        fontFamily={"Raleway-Regular"} color={customColors.textMain}
                    >
                        {userBio}
                    </Text>



                </YStack>











                <ScrollView
                    flex={1}
                    backgroundColor="#fff"
                    contentContainerStyle={{ paddingBottom: 80 }} // espace pour le bouton
                >

                    {/* TABS */}
                    <XStack
                        mt={20} px="$4" height={40}
                        alignItems="center" justifyContent="center"
                        elevation={3}
                        shadowColor="#000" shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1} shadowRadius={4}
                    >
                        <Pressable onPress={() => setSelectedTab('Past')}>
                            <Text
                                fontFamily="Raleway" fontWeight="700" fontSize={16}
                                color={selectedTab === 'Past' ? customColors.pink : customColors.textSecond}
                            >
                                Past
                            </Text>
                        </Pressable>
                        <YStack width={1} height={20} backgroundColor="#1A1B41" opacity={0.25} mx={10} />
                        <Pressable onPress={() => setSelectedTab('Upcoming')}>
                            <Text
                                fontFamily="Raleway" fontWeight="700" fontSize={16}
                                color={selectedTab === 'Upcoming' ? customColors.pink : customColors.textSecond}
                            >
                                Upcoming
                            </Text>
                        </Pressable>
                    </XStack>

                    {/* TAB CONTENT */}
                    <YStack px="$4" mt={10}>
                        {selectedTab === 'Past' ? (

                            <Text>
                                Past
                            </Text>

                        ) : (

                            <Text> Upcoming </Text>


                        )}
                    </YStack>


                    <XStack alignContent="center" justifyContent='center'>
                        <CustomButton
                            title="Log out"

                            backgroundColor={customColors.pink}
                            paddingBottom={5}
                            marginBottom={10}
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


                </ScrollView>






            </YStack>





        </View>
    );
}