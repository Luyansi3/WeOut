// app/events/[id].tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, YStack, XStack, Image, Text } from 'tamagui';
import { ChevronLeftCircle, CalendarDays, MapPinned } from '@tamagui/lucide-icons';
import { LinearGradient } from 'tamagui/linear-gradient';

import Slider from '@/components/Slider/Slider';
import Attendees from '@/components/Attendees/Attendees';
import { fetchEventById } from '@/services/eventService';
import { fetchLocationById } from '@/services/locationService';
import { fetchParticipantsByEventId } from '@/services/participantService';
import { fetchOrgaByEventId } from '@/services/organizerService';
import { EventResponse } from '@/types/Event';
import { LocationResponse } from '@/types/Location';
import { Participant } from '@/types/Participant';
import { Organizer } from '@/types/Organizer';
import { truncateText } from '@/utils/truncateText';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [organizer, setOrganizer] = useState<Organizer | null>(null)
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'About' | 'People'>('About');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchEventById(id),
      fetchOrgaByEventId(id),
      fetchParticipantsByEventId(id),
    ])
      .then(([evt, orga, parts]) => {
        setEvent(evt);
        setOrganizer(orga);
        setParticipants(parts);
        return fetchLocationById(evt.lieuId);
      })
      .then(loc => setLocation(loc))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator size="large" />;
  if (!event) return <Text>Aucune soirée trouvée</Text>;

  // Tronquer tags
  const truncatedTags = event.tags.map(t => truncateText(t, 6));

  // Dates
  const dateFull = new Date(event.debut).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const weekday = new Date(event.debut).toLocaleDateString('en-US', { weekday: 'long' });
  const timeStart = new Date(event.debut).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: 'numeric', hour12: true
  });
  const timeEnd = new Date(event.fin).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: 'numeric', hour12: true
  });

  // Avatars participants
  const avatarUrls = participants.map(p =>
    `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${p.photoProfil}`
  );

  // Nom organizer tronqué à 18
  const displayOrgName = organizer
    ? (organizer.nom.length > 18
        ? organizer.nom.slice(0, 18) + '..'
        : organizer.nom)
    : '';

  return (
    <ScrollView flex={1} backgroundColor="#fff">
      {/* COVER + BACK + PILL */}
      <YStack position="relative" width={375} height={182}>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${event.photoCouverturePath}` }}
          width={375}
          height={182}
          resizeMode="cover"
        />
        {/* Fade gradient */}
        <LinearGradient
          position="absolute"
          left={0} right={0} bottom={0}
          height={60}
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          start={[0, 0]} end={[0, 1]}
        />
        <Pressable
          onPress={() => router.back()}
          style={{ position: 'absolute', top: 16, left: 16, padding: 8 }}
        >
          <ChevronLeftCircle color="#fff" width={24} height={24} />
        </Pressable>
        <YStack
          position="absolute"
          top={146}
          left={44}
          width={295}
          height={60}
          borderRadius={30}
          backgroundColor="#fff"
          elevation={2}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={0.1}
          shadowRadius={3}
          px={16}
          justifyContent="center"
        >
          <XStack flex={1} height="100%" alignItems="center" justifyContent="space-between">
            <Attendees avatars={avatarUrls} />
            <YStack
              width={67}
              height={28}
              borderRadius={7}
              backgroundColor="#FF3C78"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontFamily="Raleway" fontWeight="700" fontSize={12} color="#fff">
                Join
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </YStack>

      {/* TITLE */}
      <YStack width={313} mx="auto" mt={38}>
        <Text fontFamily="Raleway" fontWeight="800" fontSize={35}>
          {event.nom}
        </Text>
      </YStack>

      {/* Organizer + Tags */}
      <XStack width={327} mx="auto" mt={10} alignItems="center" justifyContent="space-between">
        {organizer && (
          <XStack alignItems="center">
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${organizer.photo}` }}
              width={44} height={44}
              borderRadius={10}
            />
            <YStack ml={12.5}>
              <Text fontFamily="Raleway" fontWeight="600" fontSize={15} color="#1A1B41">
                {organizer.nom}
              </Text>
              <Text fontFamily="Raleway" fontWeight="400" fontSize={12} color="#1A1B41" opacity={0.5}>
                Organizer
              </Text>
            </YStack>
          </XStack>
        )}
        <YStack width={100} position="absolute" right={0} height={45}>
          {truncatedTags.map((txt, i) => {
            const w = 50, h = 13, gap = 5
            const col = i % 2, row = Math.floor(i / 2)
            return (
              <YStack
                key={i}
                position="absolute"
                right={col * (w + gap)}
                top={row * (h + gap)}
                width={w} height={h}
                borderRadius={4}
                backgroundColor="#8F00FF"
                alignItems="center" justifyContent="center"
              >
                <Text fontSize={9} color="#fff">{txt}</Text>
              </YStack>
            )
          })}
        </YStack>
      </XStack>

      {/* SLIDERS */}
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

      {/* DATE & TIME */}
      <XStack mt={10} px="$4">
        <YStack
          width={48} height={48} borderRadius={12}
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

      {/* LOCATION */}
      <XStack mt={20} px="$4">
        <YStack
          width={48} height={48} borderRadius={12}
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

      {/* TABS */}
      <XStack
        mt={20} px="$4" height={40}
        alignItems="center" justifyContent="center"
        elevation={3}
        shadowColor="#000" shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1} shadowRadius={4}
      >
        <Pressable onPress={() => setSelectedTab('About')}>
          <Text
            fontFamily="Raleway" fontWeight="700" fontSize={16}
            color={selectedTab === 'About' ? '#FF3C78' : '#747688'}
          >
            About
          </Text>
        </Pressable>
        <YStack width={1} height={20} backgroundColor="#1A1B41" opacity={0.25} mx={10} />
        <Pressable onPress={() => setSelectedTab('People')}>
          <Text
            fontFamily="Raleway" fontWeight="700" fontSize={16}
            color={selectedTab === 'People' ? '#FF3C78' : '#747688'}
          >
            People
          </Text>
        </Pressable>
      </XStack>

            {/* TAB CONTENT */}
            <YStack px="$4" mt={10}>
        {selectedTab === 'About' ? (
          <>
            <Text
              fontFamily="Raleway"
              fontWeight="600"
              fontSize={18}
              color="#1A1B41"
              opacity={0.84}
              mb={8}
            >
              About Event
            </Text>
            <Text
              fontFamily="Raleway"
              fontWeight="500"
              fontSize={16}
              color="#747688"
              lineHeight={22}
            >
              {event.description}
            </Text>
          </>
        ) : (
          <>
            {participants.map(p => (
              <XStack
                key={p.id}
                width={327}
                height={40}
                mx="auto"
                my={4}
                borderRadius={10}
                backgroundColor="#fff"
                px={10}
                elevation={2}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.08}
                shadowRadius={3}
                alignItems="center"
              >
                {/* Avatar */}
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${p.photoProfil}`,
                  }}
                  width={30}
                  height={30}
                  borderRadius={15}
                />

                {/* Pseudo */}
                <Text
                  ml={10}
                  fontFamily="Raleway"
                  fontWeight="700"
                  fontSize={12}
                  color="#1A1B41"
                >
                  {p.pseudo}
                </Text>

                {/* Bouton Request Friend */}
                <YStack ml="auto">
                  <YStack
                    width={123}
                    height={24}
                    borderRadius={7}
                    backgroundColor="#FF3C78"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontFamily="Raleway"
                      fontWeight="700"
                      fontSize={12}
                      color="#fff"
                    >
                      Request Friend
                    </Text>
                  </YStack>
                </YStack>
              </XStack>
            ))}
          </>
        )}
      </YStack>
    </ScrollView>
  );
}