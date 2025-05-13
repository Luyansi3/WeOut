// app/events/[id].tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, YStack, XStack, Image, Text } from 'tamagui';
import { ChevronLeftCircle, CalendarDays, MapPinned } from '@tamagui/lucide-icons';

import Slider from '@/components/Slider/Slider';
import Attendees from '@/components/Attendees/Attendees';
import { fetchEventById } from '@/services/eventService';
import { fetchLocationById } from '@/services/locationService';
import { fetchParticipantsByEventId } from '@/services/participantService';
import { EventResponse } from '@/types/Event';
import { LocationResponse } from '@/types/Location';
import { Participant } from '@/types/Participant';
import { truncateText } from '@/utils/truncateText';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'About' | 'People'>('About');

  useEffect(() => {
    if (!id) return;
    // Charger soirée, lieu et participants en parallèle
    fetchEventById(id)
      .then(evt => {
        setEvent(evt);
        return Promise.all([
          fetchLocationById(evt.lieuId),
          fetchParticipantsByEventId(id),
        ]);
      })
      .then(([loc, parts]) => {
        setLocation(loc);
        setParticipants(parts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator size="large" />;
  if (!event) return <Text>Aucune soirée trouvée</Text>;

  // Préparer tags, dates, sliders conditionnels…
  const truncatedTags = event.tags.slice(0, 4).map(t => truncateText(t, 6));
  const dateFull = new Date(event.debut).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const weekday = new Date(event.debut).toLocaleDateString('en-US', { weekday: 'long' });
  const timeStart = new Date(event.debut).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const timeEnd = new Date(event.fin).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  // Construire la liste d'URLs complètes des avatars
  const avatarUrls = participants.map(p =>
    `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${p.photoProfilPath}`
  );

  return (
    <ScrollView flex={1} backgroundColor="#fff">
      {/* Couverture + flèche + rectangle blanc + Attendees */}
      <YStack position="relative" width={375} height={182}>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${event.photoCouverturePath}` }}
          width={375} height={182} resizeMode="cover"
        />

        <Pressable
          onPress={() => router.back()}
          style={{ position: 'absolute', top: 16, left: 16, padding: 8 }}
        >
          <ChevronLeftCircle color="#fff" width={24} height={24} />
        </Pressable>

        <YStack
          position="absolute"
          top={146} left={44}
          width={295} height={60}
          borderRadius={30}
          backgroundColor="#fff"
          elevation={2}
          px={16}
          justifyContent="center"
        >
          <Attendees avatars={avatarUrls} />
        </YStack>
      </YStack>

      {/* Titre */}
      <YStack width={313} mx="auto" mt={38}>
        <Text fontFamily="Raleway" fontWeight="800" fontSize={35}>
          {event.nom}
        </Text>
      </YStack>

      {/* Tags */}
      <YStack width={327} height={45} mx="auto" mt={10} position="relative">
        {truncatedTags.map((txt, i) => {
          const w = 50, h = 13, gap = 5;
          const col = i % 2, row = Math.floor(i / 2);
          const rightBase = 66;
          return (
            <YStack
              key={i}
              position="absolute"
              right={rightBase - col * (w + gap)}
              top={row * (h + gap)}
              width={w} height={h}
              borderRadius={4}
              backgroundColor="#8F00FF"
              alignItems="center" justifyContent="center"
            >
              <Text fontSize={9} color="#fff">{txt}</Text>
            </YStack>
          );
        })}
      </YStack>

      {/* Sliders conditionnels */}
      <YStack mt={10} space={10} px="$4">
        {event.dancing != null && (
          <Slider title="Dancing" value={event.dancing} max={100} icon="💃" width={314} height={10} />
        )}
        {event.alcohool != null && (
          <Slider title="Alcohol" value={event.alcohool} max={100} icon="🍹" width={314} height={10} />
        )}
        {event.talking != null && (
          <Slider title="Talk" value={event.talking} max={100} icon="🗣️" width={314} height={10} />
        )}
      </YStack>

      {/* Calendrier & horaire */}
      <XStack mt={10} px="$4">
        <YStack width={48} height={48} borderRadius={12}
          backgroundColor="rgba(255,60,120,0.1)"
          alignItems="center" justifyContent="center"
        >
          <CalendarDays width={24} height={24} color="#FF3C78" />
        </YStack>
        <YStack ml={14} justifyContent="center">
          <Text fontFamily="Raleway" fontWeight="600" fontSize={16} color="#1A1B41" opacity={0.84}>
            {dateFull}
          </Text>
          <Text fontFamily="Raleway" fontWeight="400" fontSize={12} color="#747688">
            {`${weekday}, ${timeStart} - ${timeEnd}`}
          </Text>
        </YStack>
      </XStack>

      {/* Lieu */}
      <XStack mt={20} px="$4">
        <YStack width={48} height={48} borderRadius={12}
          backgroundColor="rgba(255,60,120,0.1)"
          alignItems="center" justifyContent="center"
        >
          <MapPinned width={24} height={24} color="#FF3C78" />
        </YStack>
        <YStack ml={14} justifyContent="center">
          <Text fontFamily="Raleway" fontWeight="600" fontSize={16} color="#1A1B41" opacity={0.84}>
            {location?.nom ?? 'Unknown'}
          </Text>
          <Text fontFamily="Raleway" fontWeight="400" fontSize={12} color="#747688">
            {location?.adresse ?? ''}
          </Text>
        </YStack>
      </XStack>

      {/* Onglets */}
      <XStack mt={20} px="$4" height={40} alignItems="center" justifyContent="center">
        <Pressable onPress={() => setSelectedTab('About')}>
          <Text fontFamily="Raleway" fontWeight="700" fontSize={16}
                color={selectedTab === 'About' ? '#FF3C78' : '#747688'}>
            About
          </Text>
        </Pressable>
        <YStack width={1} height={20} backgroundColor="#1A1B41" opacity={0.25} mx={10}/>
        <Pressable onPress={() => setSelectedTab('People')}>
          <Text fontFamily="Raleway" fontWeight="700" fontSize={16}
                color={selectedTab === 'People' ? '#FF3C78' : '#747688'}>
            People
          </Text>
        </Pressable>
      </XStack>

      {/* Contenu des onglets */}
      <YStack px="$4" mt={10}>
        {selectedTab === 'About' ? (
          <>
            <Text fontFamily="Raleway" fontWeight="600" fontSize={18} color="#1A1B41" opacity={0.84} mb={8}>
              About Event
            </Text>
            <Text fontFamily="Raleway" fontWeight="500" fontSize={16} color="#747688" lineHeight={22}>
              {event.description}
            </Text>
          </>
        ) : (
          <Text fontFamily="Raleway" fontWeight="400" fontSize={14} color="#1A1B41">
            Voici les participants de la soirée
          </Text>
        )}
      </YStack>
    </ScrollView>
  );
}