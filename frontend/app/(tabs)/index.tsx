import { View, YStack, ScrollView } from 'tamagui';


import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


// components:
import Header from '@/components/Header/Header';
import EventCard from '@/components/EventCard/EventCard';

// types:
import { EventResponse, SoireeParams } from '@/types/Event';
import { LocationResponse } from '@/types/Location';

// hooks:
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

// services:
import { fetchLocationById } from '@/services/locationService';
import { setMe } from '@/services/setMeService';
import { fetchEvents } from '@/services/eventService';
import CustomButton from '@/components/CustomButton';


export default function IndexScreen() {

    // VARS:
    const [events, setEvents] = useState([] as EventResponse[]);
    const [locations, setLocations] = useState([] as LocationResponse[]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();


    
    const customColors = {
        background: "#F5F5F7",
        pink: "#FF3C78",
        purple: "#8F00FF",
        textSecond: "#747688",
        textMain: "#1A1B41"
    };

    // HOOKS:
    // Checking authentication:
    useAuthRedirect(); // check if there is a token in AsyncStorage otherwise redirect to login


    // Fetching events and locations:
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
        const eventsData = await fetchEvents(parameters);
        setEvents(eventsData);

        const locationPromises = eventsData.map(evt =>
          fetchLocationById(evt.lieuId)
        );
        const locationsData = await Promise.all(locationPromises);
        setLocations(locationsData);
      } catch (err) {
        console.error('Error fetching events or locations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (loading) return <ActivityIndicator style={{ alignContent: "center", alignItems: "center" }} size="large" />;

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
                    <CustomButton
                        title="Log out"

                        backgroundColor={customColors.pink}
                        minWidth={250}
                        minHeight={60}
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


                </YStack>

            </ScrollView>


        </View>
    );
  }

  return (
    <View flex={1} backgroundColor="#ECECEC" alignItems="center">
      <Header />

      <ScrollView width="100%" backgroundColor="#F2F2F2" padding="$4">
        <YStack gap="$4">
          {events.map((event, idx) => {
            const loc = locations[idx];
            return (
              <Pressable
                key={event.id}
                onPress={() => router.push(`/events/${event.id}`)}
              >
                <EventCard
                  image={event.photoCouverturePath}
                  title={event.nom}
                  description={event.description}
                  date={new Date(event.debut)
                    .toLocaleDateString()
                    .replace(/-/g, '/')}
                  location={loc?.adresse ?? 'Unknown location'}
                />
              </Pressable>
            );
          })}
        </YStack>
      </ScrollView>
    </View>
  );
}