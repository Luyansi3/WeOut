import { View, YStack, ScrollView } from 'tamagui';
import Header from '@/components/Header/Header';
import EventCard from '@/components/EventCard/EventCard';
import { fetchEvents } from '@/services/eventService';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Event } from '@/types/Event';

export default function IndexScreen() {
    const [events, setEvents] = useState([] as Event[]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    fetchEvents()
        .then((data) => {
            console.log(data);
            setEvents(data);
            setLoading(false);
        })
        .catch((err) => {
            setLoading(false);
        });
    }, []);
    if (loading) return <ActivityIndicator size="large" />;
    
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
                    {events.map((event: Event, index) => (
                        <EventCard
                            key={index}
                            image={require("@/assets/images/eventsimages/eventimage.png")}
                            title={event.nom}
                            description={event.description}
                            date={new Date(event.debut).toLocaleDateString().replace(/-/g, "/")}
                            location={"TEMP LOCATION"}
                        />
                    ))}
                </YStack>

            </ScrollView>
        </View>
    );
}