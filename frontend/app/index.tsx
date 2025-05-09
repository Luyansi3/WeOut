import { NavigationBar } from '@/components/NavBar';
import { Calendar, MapPin } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { Button, Image, ScrollView, Text, View, XStack, YStack } from 'tamagui';

export default function IndexScreen() {
    const router = useRouter();

    return (
        <View flex={1} justifyContent="center" alignItems="center"
            backgroundColor="#ECECEC">

            <HeaderBar />
            
            <ScrollView
                width="100%"
                backgroundColor="#F2F2F2"
                padding={"$4"}
            >

                <YStack
                    gap={"$4"}>
                    <EventCard>

                    </EventCard>

                    <EventCard>
                    </EventCard>

                    <EventCard>
                    </EventCard>
                </YStack>

            </ScrollView>

            <NavigationBar active="home" onPress={(name) => console.log(name)} />
        </View>
    );
}

const HeaderBar = () => {
    const router = useRouter();
    return (
        <XStack
                width="100%"
                height={100}
                backgroundColor="#FF3C78"
                justifyContent="space-between"
                alignItems="center"
                padding="$4"
            >

                <Image
                    source={require('../assets/images/WeOutLogo.png')}
                    style={{ width: 40, height: 40 }}
                />

                <Button
                    onPress={() => router.push('/userprofile')}
                    width={40}
                    height={40}
                    icon={
                        <Image
                            source={require('../assets/profile_pictures/hamza_wirane.png')}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    }
                    backgroundColor="transparent"
                    padding={0}
                    margin={0}
                />
            </XStack>
    );
}

const EventCard = () => {
    return (
        <View
            width="100%"
            padding={15}
            borderRadius={18}
            alignItems='center'
            backgroundColor="white"
        >
            <YStack
                gap={"$2"}
                width="100%"
            >
                <Image 
                    alignSelf='center'
                    source={require('../assets/images/eventsimages/eventimage.png')}
                    borderRadius={15}
                />

                <Text fontWeight={600} fontSize={"$8"}>International Band Music Festival</Text>
                <Text flexWrap='wrap'>
                    {`Join us for an electrifying night at the International Band Music Concert, where global rhythms jzhfaiuzgfkauzegfaufzyegfkauyzgefuyfazegfkezuyfagfeoufaygfzkfauyzgfzkfuyg`.length > 100
                        ? `Join us for an electrifying night at the International Band Music Concert, where global rhythms`.slice(0, 100) + '...'
                        : `Join us for an electrifying night at the International Band Music Concert, where global rhythms jzhfaiuzgfkauzegfaufzyegfkauyzgefuyfazegfkezuyfagfeoufaygfzkfauyzgfzkfuyg`}
                </Text>
                
                <XStack
                    gap={"$2"}
                    alignItems="flex-start">
                    
                    <Calendar width={20} height={20} color={"black"} />
                    <Text color="gray">June 10 2025</Text>
                </XStack>
                <XStack
                    gap={"$2"}
                    alignItems="flex-start">
                    <MapPin width={20} height={20} color={"black"} />
                    <Text color={"gray"}>36 Guild Street, London, UK</Text>
                </XStack>
            </YStack>
            
        </View>
    );
}
