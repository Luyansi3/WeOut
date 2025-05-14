// app/events/[id].tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, YStack, XStack, Image, Text } from 'tamagui';
import { ChevronLeftCircle, CalendarDays, MapPinned } from '@tamagui/lucide-icons';
import { LinearGradient } from 'tamagui/linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

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
  const { width: screenWidth } = useWindowDimensions();
  const scale = screenWidth / 375; // design width reference

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
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

  // Prépare les données
  const truncatedTags = event.tags.map(t => truncateText(t, 6));
  const dateFull = new Date(event.debut).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const weekday = new Date(event.debut).toLocaleDateString('en-US', { weekday: 'long' });
  const timeStart = new Date(event.debut).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: 'numeric', hour12: true,
  });
  const timeEnd = new Date(event.fin).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: 'numeric', hour12: true,
  });
  const avatarUrls = participants.map(p =>
    `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${p.photoProfil}`
  );
  const displayOrgName = organizer
    ? (organizer.nom.length > 18 ? organizer.nom.slice(0, 18) + '..' : organizer.nom)
    : '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 * scale }}
      >
        {/* COVER + GRADIENT + PILL */}
        <YStack position="relative" width={screenWidth} height={182 * scale}>
          <Image
            position="absolute"
            top={0}
            left={0}
            source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${event.photoCouverturePath}` }}
            width={screenWidth}
            height={182 * scale}
            resizeMode="cover"
          />
          <LinearGradient
            position="absolute"
            left={0} right={0} bottom={0}
            height={60 * scale}
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
            start={[0, 0]} end={[0, 1]}
          />
          <YStack
            position="absolute"
            top={146 * scale} left={44 * scale}
            width={295 * scale} height={60 * scale}
            borderRadius={30 * scale}
            backgroundColor="#fff"
            elevation={2}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 1 }}
            shadowOpacity={0.1}
            shadowRadius={3}
            px={16 * scale}
            justifyContent="center"
          >
            <XStack flex={1} height="100%" alignItems="center" justifyContent="space-between">
              <Attendees avatars={avatarUrls} />
              <YStack
                width={67 * scale} height={28 * scale}
                borderRadius={7 * scale} backgroundColor="#FF3C78"
                alignItems="center" justifyContent="center"
              >
                <Text fontFamily="Raleway" fontWeight="700" fontSize={12 * scale} color="#fff">
                  Join
                </Text>
              </YStack>
            </XStack>
          </YStack>
        </YStack>

        {/* TITLE */}
        <YStack width={313 * scale} mx="auto" mt={38 * scale}>
          <Text fontFamily="Raleway" fontWeight="800" fontSize={35 * scale}>
            {event.nom}
          </Text>
        </YStack>

        {/* ORGANIZER + TAGS */}
        <XStack
          width={327 * scale} mx="auto" mt={10 * scale}
          alignItems="center" justifyContent="space-between"
        >
          {organizer && (
            <XStack alignItems="center">
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${organizer.photo}` }}
                width={44 * scale} height={44 * scale}
                borderRadius={10 * scale}
              />
              <YStack ml={12.5 * scale}>
                <Text fontFamily="Raleway" fontWeight="600" fontSize={15 * scale} color="#1A1B41">
                  {displayOrgName}
                </Text>
                <Text fontFamily="Raleway" fontWeight="400" fontSize={12 * scale} color="#1A1B41" opacity={0.5}>
                  Organizer
                </Text>
              </YStack>
            </XStack>
          )}
          <YStack width={100 * scale} position="absolute" right={0} height={45 * scale}>
            {truncatedTags.map((txt, i) => {
              const w = 50 * scale, h = 13 * scale, gap = 5 * scale;
              const col = i % 2, row = Math.floor(i / 2);
              return (
                <YStack
                  key={i}
                  position="absolute"
                  right={col * (w + gap)}
                  top={row * (h + gap)}
                  width={w} height={h}
                  borderRadius={4 * scale}
                  backgroundColor="#8F00FF"
                  alignItems="center" justifyContent="center"
                >
                  <Text fontSize={9 * scale} color="#fff">{txt}</Text>
                </YStack>
              );
            })}
          </YStack>
        </XStack>

        {/* SLIDERS */}
        <YStack mt={10 * scale} space={10 * scale} px={16 * scale}>
          {event.dancing != null && (
            <Slider title="Dancing" value={event.dancing} max={100} icon="💃" width={314 * scale} height={10 * scale} />
          )}
          {event.alcohool != null && (
            <Slider title="Alcohol" value={event.alcohool} max={100} icon="🍹" width={314 * scale} height={10 * scale} />
          )}
          {event.talking != null && (
            <Slider title="Talk" value={event.talking} max={100} icon="🗣️" width={314 * scale} height={10 * scale} />
          )}
        </YStack>

        {/* DATE & TIME */}
        <XStack mt={10 * scale} px={16 * scale}>
          <YStack
            width={48 * scale} height={48 * scale} borderRadius={12 * scale}
            backgroundColor="rgba(255,60,120,0.1)"
            alignItems="center" justifyContent="center"
          >
            <CalendarDays width={24 * scale} height={24 * scale} color="#FF3C78" />
          </YStack>
          <YStack ml={14 * scale} justifyContent="center">
            <Text fontFamily="Raleway" fontWeight="600" fontSize={16 * scale} color="#1A1B41" opacity={0.84}>
              {dateFull}
            </Text>
            <Text fontFamily="Raleway" fontWeight="400" fontSize={12 * scale} color="#747688">
              {`${weekday}, ${timeStart} - ${timeEnd}`}
            </Text>
          </YStack>
        </XStack>

        {/* LOCATION */}
        <XStack mt={20 * scale} px={16 * scale}>
          <YStack
            width={48 * scale} height={48 * scale} borderRadius={12 * scale}
            backgroundColor="rgba(255,60,120,0.1)"
            alignItems="center" justifyContent="center"
          >
            <MapPinned width={24 * scale} height={24 * scale} color="#FF3C78" />
          </YStack>
          <YStack ml={14 * scale} justifyContent="center">
            <Text fontFamily="Raleway" fontWeight="600" fontSize={16 * scale} color="#1A1B41" opacity={0.84}>
              {location?.nom ?? 'Unknown'}
            </Text>
            <Text fontFamily="Raleway" fontWeight="400" fontSize={12 * scale} color="#747688">
              {location?.adresse ?? ''}
            </Text>
          </YStack>
        </XStack>

        {/* TABS */}
        <XStack
          mt={20 * scale} px={16 * scale} height={40 * scale}
          alignItems="center" justifyContent="center"
          elevation={3}
          shadowColor="#000" shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1} shadowRadius={4 * scale}
        >
          <Pressable onPress={() => setSelectedTab('About')}>
            <Text fontFamily="Raleway" fontWeight="700" fontSize={16 * scale}
                  color={selectedTab === 'About' ? '#FF3C78' : '#747688'}>
              About
            </Text>
          </Pressable>
          <YStack width={1 * scale} height={20 * scale} backgroundColor="#1A1B41" opacity={0.25} mx={10 * scale} />
          <Pressable onPress={() => setSelectedTab('People')}>
            <Text fontFamily="Raleway" fontWeight="700" fontSize={16 * scale}
                  color={selectedTab === 'People' ? '#FF3C78' : '#747688'}>
              People
            </Text>
          </Pressable>
        </XStack>

        {/* TAB CONTENT */}
        <YStack px={16 * scale} mt={10 * scale}>
          {selectedTab === 'About' ? (
            <>
              <Text
                fontFamily="Raleway" fontWeight="600" fontSize={18 * scale}
                color="#1A1B41" opacity={0.84} mb={8 * scale}
              >
                About Event
              </Text>
              <Text
                fontFamily="Raleway" fontWeight="500" fontSize={16 * scale}
                color="#747688" lineHeight={22 * scale}
              >
                {event.description}
              </Text>
            </>
          ) : (
            participants.map(p => (
              <XStack
                key={p.id}
                width={327 * scale} height={40 * scale} mx="auto" my={4 * scale}
                borderRadius={10 * scale} backgroundColor="#fff" px={10 * scale}
                elevation={2}
                shadowColor="#000" shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.08} shadowRadius={3 * scale}
                alignItems="center"
              >
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${p.photoProfil}` }}
                  width={30 * scale} height={30 * scale} borderRadius={15 * scale}
                />
                <Text
                  ml={10 * scale} fontFamily="Raleway" fontWeight="700" fontSize={12 * scale}
                  color="#1A1B41"
                >
                  {p.pseudo}
                </Text>
                <YStack ml="auto">
                  <YStack
                    width={123 * scale} height={24 * scale} borderRadius={7 * scale}
                    backgroundColor="#FF3C78" alignItems="center" justifyContent="center"
                  >
                    <Text fontFamily="Raleway" fontWeight="700" fontSize={12 * scale} color="#fff">
                      Request Friend
                    </Text>
                  </YStack>
                </YStack>
              </XStack>
            ))
          )}
        </YStack>
      </ScrollView>

      {/* BOUTON RETOUR FIXE */}
      <Pressable
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 16 * scale,
          left: 16 * scale,
          zIndex: 10,
          padding: 8,
        }}
      >
        <ChevronLeftCircle color="#fff" width={24 * scale} height={24 * scale} />
      </Pressable>
    </SafeAreaView>
  );
}