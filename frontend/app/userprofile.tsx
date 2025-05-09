import { View, Input, Button, Text, Image, XStack, YStack, SizableText, Tabs, Separator, TabsContentProps } from 'tamagui';
import { Instagram, Twitter, Users2, PartyPopper } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router';
import React from 'react';

export default function UserprofileScreen() {
    const router = useRouter();

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
                    flex={1}
                    width="100%"
                    padding={"$4"}
                    gap="$2"
                    backgroundColor="white"
                >
                    <Text fontSize="$8">Hamza Wirane</Text>
                    <Text fontSize="$6" color="gray">@hamza.wirane</Text>
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
                            <Text fontSize="$6">350</Text>
                        </XStack>
                        <XStack gap="$2">
                            <PartyPopper
                                width={24}
                                height={24}
                            />
                            <Text fontSize="$6">24</Text>
                        </XStack>
                    </XStack>
                    <XStack
                        gap="$4"

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
                        Toujours partant pour de nouvelles vibes
                    </Text>

                    <Tabs

                        defaultValue="tab1"
                        width={'100%'}
                        orientation="horizontal"
                        flexDirection="column"
                        height={150}
                        overflow="hidden"
                    >
                        <Tabs.List
                            separator={<Separator vertical />}
                        >
                            <Tabs.Tab
                                focusStyle={{
                                    backgroundColor: '$color3',
                                }}
                                flex={1}
                                value="tab1"
                            >
                                <SizableText fontFamily="$body" textAlign="center">
                                    Past
                                </SizableText>
                            </Tabs.Tab>
                            <Tabs.Tab
                                focusStyle={{
                                    backgroundColor: '$color3',
                                }}
                                flex={1}
                                value="tab2"
                            >
                                <SizableText fontFamily="$body" textAlign="center">
                                    Upcoming
                                </SizableText>
                            </Tabs.Tab>



                        </Tabs.List>

                        <Tabs.Content
                            value="tab1"
                            flex={1}
                            backgroundColor="white"
                            marginTop={"$6"}
                        >
                            <Text fontSize="$6" textAlign="center">
                                No past parties
                            </Text>


                        </Tabs.Content>
                        <Tabs.Content
                            value="tab2"
                            flex={1}
                            backgroundColor="white"
                            marginTop={"$6"}
                        >
                            <Text
                                fontSize="$6"
                                textAlign="center"
                            >
                                No upcoming parties
                            </Text>
                        </Tabs.Content>

                    </Tabs>



                </YStack>
            </YStack>

        </View>
    );
}