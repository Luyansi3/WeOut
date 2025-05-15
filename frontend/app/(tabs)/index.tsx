import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { View, ScrollView, YStack } from 'tamagui';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/Header/Header';
import EventCard from '@/components/EventCard/EventCard';

// types:
import { EventResponse, SoireeParams } from '@/types/Event';
import { LocationResponse } from '@/types/Location';

// hooks:
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

// services:
import { fetchLocationById } from '@/services/locationService';
import { fetchParticipantsByEventId } from '@/services/participantService';
import { setMe } from '@/services/setMeService';
import { fetchEventByUserId, fetchEvents } from '@/services/eventService';
import CustomButton from '@/components/CustomButton';
import { isNearPlace } from '@/utils/isNearPlace';
import HeaderWithNote from '@/components/HeaderWithNote/HeaderWithNote';

export default function IndexScreen() {

    // VARS:
    const [events, setEvents] = useState([] as EventResponse[]);
    const [locations, setLocations] = useState([] as LocationResponse[]);
    const [loading, setLoading] = useState(true);
    const [showNote, setShowNote] = useState(false);
    const [event, setEvent] = useState({} as EventResponse);
    const [location, setLocation] = useState({} as LocationResponse);
    const [avatarsList, setAvatarsList] = useState([] as string[][]);
    const [value, setValue] = useState(0);

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


    const loadData = useCallback(async () => {
      try {
        setLoading(true);
        // 1. Events
        const params: SoireeParams = { isStrictTag: false, tags: [] };
        const eventsData = await fetchEvents(params);
        setEvents(eventsData);

        // 2. Locations
        const locPromises = eventsData.map(evt => fetchLocationById(evt.lieuId));
        const locs = await Promise.all(locPromises);
        setLocations(locs);

        // 3. Participants → avatars
        const partPromises = eventsData.map(evt => fetchParticipantsByEventId(evt.id));
        const partsData = await Promise.all(partPromises);
        const avArray = partsData.map(parts =>
          parts.map(p => `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${p.photoProfil}`)
        );
        setAvatarsList(avArray);
      } catch (err) {
        console.error('Error fetching events, locations or participants:', err);
      } finally {
        setLoading(false);
      }
    }, []);


    useEffect(() => {
        (async () => {
            await setMe(router); // set the user in AsyncStorage
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const userString = await AsyncStorage.getItem('user');
            const user_obj = userString ? JSON.parse(userString) : {};
            if (!user_obj.id) return;

            console.log("fetching events for checking");
            const events = await fetchEventByUserId(user_obj.id);

            let minDist: number = Number.MAX_SAFE_INTEGER;
            let closestEvent: EventResponse | null = null;
            let closestLocation: LocationResponse | null = null;

            for (const e of events) {
            try {
                const loc = await fetchLocationById(e.lieuId);
                const dist = await isNearPlace(loc);

                if (dist < minDist) {
                minDist = dist;
                closestEvent = e;
                closestLocation = loc;
                }
            } catch (err) {
                console.log("Error checking location/event:", err);
            }
            }
            if (closestEvent && closestLocation && minDist <= 100) {
                const now = Date.now();
                const start = Date.parse(closestEvent.debut);
                const end = Date.parse(closestEvent.fin);
                if (!isNaN(start) && !isNaN(end) && now >= start && now <= end) {
                    setShowNote(true);
                    setEvent(closestEvent);
                    setLocation(closestLocation);
                    console.log("Valid event found:", closestEvent);
                    return;
                }
            }

            setShowNote(false);
        })();
        }, []);

    useEffect(() => {
        (async () => {
            const userString = await AsyncStorage.getItem('user');
            const user_obj = userString ? JSON.parse(userString) : {};
            if (!user_obj.id) return;
            /* const events = await fetchEventByUserId(user_obj.id);
            setEvents(events); */
        })();
    }, [value])



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

        fetchEventsWithLocations();
    }, []);

  // charge au premier rendu + chaque fois que l’écran reprend le focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} size="large" />
    );
  }

  return (
    <View flex={1} backgroundColor={customColors.background} alignItems="center">
      {!showNote && <Header />} 
    {showNote && <HeaderWithNote event={event} value={value} setValue={setValue}/>}

      <ScrollView width="100%" backgroundColor={customColors.background} padding="$4">
        <YStack gap="$4">
          {events.map((event, idx) => {
            const loc = locations[idx];
            const avatars = avatarsList[idx] ?? [];
            return (
              <Pressable key={event.id} onPress={() => router.push(`/events/${event.id}`)}>
                <EventCard
                  image={event.photoCouverturePath}
                  title={event.nom}
                  description={event.description}
                  date={new Date(event.debut).toLocaleDateString().replace(/-/g, '/')}
                  location={loc?.adresse ?? 'Unknown location'}
                  avatars={avatars}
                />
              </Pressable>
            );
          })}

          <CustomButton
            title="Log out"
            backgroundColor={customColors.pink}
            minWidth={250}
            minHeight={60}
            borderRadius={15}
            fontSize={15}
            fontFamily="Raleway-SemiBold"
            pressStyle={{ backgroundColor: customColors.pink }}
            focusStyle={{ backgroundColor: customColors.pink }}
            hoverStyle={{ backgroundColor: customColors.pink }}
            onPress={async () => {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              router.replace('/login');
            }}
          />
        </YStack>
      </ScrollView>
    </View>
  );
}