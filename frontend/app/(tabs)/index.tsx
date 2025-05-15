import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { View, ScrollView, YStack } from 'tamagui';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/Header/Header';
import EventCard from '@/components/EventCard/EventCard';
import CustomButton from '@/components/CustomButton';

import { EventResponse, SoireeParams } from '@/types/Event';
import { LocationResponse } from '@/types/Location';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { fetchEvents } from '@/services/eventService';
import { fetchLocationById } from '@/services/locationService';
import { fetchParticipantsByEventId } from '@/services/participantService';

export default function IndexScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [avatarsList, setAvatarsList] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  const customColors = {
    background: '#F5F5F7',
    pink: '#FF3C78',
    purple: '#8F00FF',
    textSecond: '#747688',
    textMain: '#1A1B41',
  };

  useAuthRedirect();

  /**
   * Charge les événements, lieux et participants.
   * Sera rappelé à chaque focus de l’écran pour garantir des données fraîches.
   */
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
      <Header />
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