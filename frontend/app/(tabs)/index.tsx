import { View, YStack, ScrollView } from 'tamagui';
import Header from '@/components/Header/Header';
import EventCard from '@/components/EventCard/EventCard';
import { fetchEvents } from '@/services/eventService';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { EventResponse, SoireeParams } from '@/types/Event';
import { fetchLocationById } from '@/services/locationService';
import { LocationResponse } from '@/types/Location';

export default function IndexScreen() {
    const [events, setEvents] = useState([] as EventResponse[]);
    const [locations, setLocations] = useState([] as LocationResponse[]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventsWithLocations = async () => {
            try {
            const parameters: SoireeParams = {
                isStrictTag: false,
                tags: [],
            };
            const eventsData = await fetchEvents(parameters);
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

    if (loading) return <ActivityIndicator style={{alignContent: "center", alignItems: "center"}} size="large" />;
    
    return (
        <View flex={1} justifyContent="center" alignItems="center"
            backgroundColor="#ECECEC">
            <Header />

            <ScrollView
                width="100%"
                backgroundColor="F5F5F7"
                padding={"$4"}
            >

                <YStack
                    gap={"$4"}>
                    {events.map((event: EventResponse, index) => {
                        const location = locations[index]; // assuming order matches
                        console.log(`${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${event.photoCouverturePath}`)
                        return (
                            <EventCard
                            key={index}
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