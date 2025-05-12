import { View, YStack, ScrollView } from 'tamagui';
import Header from '@/components/Header/Header';
import EventCard from '@/components/EventCard/EventCard';
import { fetchAllEvents } from '@/services/eventService';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { EventResponse } from '@/types/Event';
import { fetchLocationById } from '@/services/locationService';
import { LocationResponse } from '@/types/Location';

export default function IndexScreen() {
    const [events, setEvents] = useState([] as EventResponse[]);
    const [locations, setLocations] = useState([] as LocationResponse[]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventsWithLocations = async () => {
            try {
            const eventsData = await fetchAllEvents({});
            setEvents(eventsData);

            const locationPromises = eventsData.map((event) =>
                fetchLocationById(event.lieuId)
            );

            const locationsData = await Promise.all(locationPromises);
            setLocations(locationsData);
            } catch (err) {
            console.log("Error fetching events or locations:", err);
            } finally {
            setLoading(false);
            }
        };

        fetchEventsWithLocations();
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
                    {events.map((event: EventResponse, index) => {
                        const location = locations[index]; // assuming order matches
                        console.log(`${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${event.photoCouverturePath}`)
                        return (
                            <EventCard
                            image={event.photoCouverturePath}
                            title={event.nom}
                            description={event.description}
                            date={new Date(event.debut).toLocaleDateString().replace(/-/g, "/")}
                            location={location ? location.adresse : "Unknown location"}
                            />
                        );
                    })}
                </YStack>

            </ScrollView>
        </View>
    );
}