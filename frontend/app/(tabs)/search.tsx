import { View, Text, YStack, XStack, ScrollView, Input } from 'tamagui';
import { useRouter } from 'expo-router';
import EventCard from '@/components/EventCard/EventCard';
import { useEffect, useState } from 'react';
import { EventResponse } from '@/types/Event';
import { LocationResponse } from '@/types/Location';
import { fetchEvents, fetchEventsByName } from '@/services/eventService';
import { fetchLocationById } from '@/services/locationService';
import { ActivityIndicator } from 'react-native';

export default function SearchScreen() {
    const router = useRouter();
    const [searchResults, setSearchResults] = useState([] as EventResponse[]);
    const [locations, setLocations] = useState([] as LocationResponse[]);
    const [loading, setLoading] = useState(true);

    const fetchEventsFromSearchWithLocations = async (text: string) => {
        try {
        const eventsData = await fetchEventsByName(text);
        setSearchResults(eventsData);

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

    return (
        <View >
            <YStack 
                width="100%"
            >
                <View
                    width="100%"
                    margin={0}
                    height={150}
                    backgroundColor="#FF3C78"
                    paddingLeft={"$4"}
                    paddingRight={"$4"}
                    paddingTop={"$11"}
                >
                    <Input
                        size="$5"
                        borderWidth={2}
                        borderColor="#FFFFFF"
                        borderRadius={100}
                        placeholder='Search for events'
                        placeholderTextColor={"#FFFFFF"}
                        color={"#FFFFFF"}
                        backgroundColor='transparent'
                        onChangeText={
                            (text) => {
                                if (text.length > 0) {
                                    fetchEventsFromSearchWithLocations(text);
                                }
                            }
                        }


                    />
                </View>
                
                <ScrollView
                    width="100%"
                    height="80%"
                    backgroundColor="#F2F2F2"
                    padding={"$4"}
                >
                    <YStack
                    gap={"$4"}>
                    {searchResults.map((event: EventResponse, index) => {
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
            </YStack>
        </View>
    );
}
