import { View, YStack, ScrollView } from 'tamagui';
import Header from '@/components/Header/Header';
import EventCard from '@/components/EventCard/EventCard';

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
                    <EventCard />
                    <EventCard />
                    <EventCard />
                    <EventCard />
                </YStack>

            </ScrollView>
        </View>
    );
}