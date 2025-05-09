import { View, Button, Text, XStack, Image, YStack, ScrollView } from 'tamagui';
import { MapPin, Calendar } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router';
import Header from '@/components/Header';

export default function IndexScreen() {
    return (
        <View flex={1} justifyContent="center" alignItems="center"
            backgroundColor="#ECECEC">
            <Header />

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
        </View>
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
                    source={require('@/assets/images/eventsimages/eventimage.png')}
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
