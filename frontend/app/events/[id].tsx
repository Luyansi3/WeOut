// app/events/[id].tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ScrollView,
  YStack,
  XStack,
  Image,
  Text,
  View,
  Button,
} from 'tamagui';
import {
  ChevronLeftCircle,
  CalendarDays,
  MapPinned,
  ArrowRightCircle,
  Star,
  Dot,
} from '@tamagui/lucide-icons';
import { LinearGradient } from 'tamagui/linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setMe } from '@/services/setMeService'; // import the setMe helper

import Slider from '@/components/Slider/Slider';
import Attendees from '@/components/Attendees/Attendees';
import { fetchEventById } from '@/services/eventService';
import { fetchLocationById } from '@/services/locationService';
import { fetchParticipantsByEventId } from '@/services/participantService';
import { fetchOrgaByEventId } from '@/services/organizerService';
import {
  participateUser,
  unsubscribeUser,
} from '@/services/participationService';
import {getListFriends, sendFriendRequest, checkFriendshipStatus} from '@/services/friendService';

import { EventResponse } from '@/types/Event';
import { LocationResponse } from '@/types/Location';
import { Participant } from '@/types/Participant';
import { Organizer } from '@/types/Organizer';
import { truncateText } from '@/utils/truncateText';
import { useMemo } from 'react';
import { fetchNote } from '@/services/noteService';


export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const scale = screenWidth / 375;

  // --- STATE ---
  const [me, setMeState] = useState<{ id: string } | null>(null);
  const [loadingMe, setLoadingMeFlag] = useState(true);

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [note, setNote] = useState(null as number | null);
  const [live, setLive] = useState(false);

  const [isParticipating, setIsParticipating] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'About' | 'People'>('About');

  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);


  // 1) Charger "me" via API puis AsyncStorage
  useEffect(() => {
    const initMe = async () => {
      console.log('[EventDetail] → initMe start');
      // fetch and store in AsyncStorage or redirect if no token
      await setMe(router);
      console.log('[EventDetail] ← setMe completed');
      try {
        const json = await AsyncStorage.getItem('user');
        console.log('[EventDetail] AsyncStorage.getItem user:', json);
        if (json) {
          const user = JSON.parse(json);
          console.log('[EventDetail] parsed user:', user);
          setMeState(user);
        }
      } catch (err) {
        console.error('[EventDetail] error reading user from AsyncStorage', err);
      } finally {
        setLoadingMeFlag(false);
        console.log('[EventDetail] loadingMe = false');
      }
    };
    initMe();
  }, [router]);

  // 2) Charger les amis de l’utilisateur
  useEffect(() => {
    if (!me) return;
    console.log('[EventDetail] fetch friendIds for', me.id);
    getListFriends(me.id)
      .then(ids => {
        console.log('[EventDetail] friendIds =', ids);
        setFriendIds(ids);
      })
      .catch(err => console.error('[EventDetail] getListFriends error', err));
  }, [me]);
  

  // 2) Charger toutes les données
  const loadData = useCallback(async () => {
    if (!id) {
      console.warn('[EventDetail] pas d’id fourni, skip loadData');
      return;
    }
    console.log(`[EventDetail] → loadData pour event id=${id}`);
    setLoadingData(true);
    try {
      const [evt, orga, parts] = await Promise.all([
        fetchEventById(id),
        fetchOrgaByEventId(id),
        fetchParticipantsByEventId(id),
      ]);
      console.log('[EventDetail] fetch OK', { evt, orga, partsCount: parts.length });
      setEvent(evt);
      setOrganizer(orga);
      setParticipants(parts);
      const loc = await fetchLocationById(evt.lieuId);
      console.log('[EventDetail] fetchLocation OK', loc);
      setLocation(loc);
    } catch (err) {
      console.error('[EventDetail] loadData error', err);
    } finally {
      setLoadingData(false);
      console.log('[EventDetail] loadingData = false');
    }
  }, [id]);

  useEffect(() => {
    if (!loadingMe) {
      console.log('[EventDetail] loadingMe false, trigger loadData');
      loadData();
    }
  }, [loadingMe, loadData]);

  // 3) Déterminer participation
  useEffect(() => {
    if (me) {
      const participating = participants.some(p => p.id === me.id);
      console.log('[EventDetail] isParticipating =', participating);
      setIsParticipating(participating);
    }
  }, [me, participants]);

  const sortedParticipants = useMemo(() => {
    if (!me) return participants;
    const self = participants.find(p => p.id === me.id);
    const others = participants.filter(p => p.id !== me.id);
    return self ? [self, ...others] : participants;
  }, [participants, me]);
  
  useEffect(() => {
    if (!me || participants.length === 0) return;
  
    const toCheck = participants
      .map(p => p.id)
      // on ignore soi-même et les amis déjà confirmés
      .filter(id => id !== me.id && !friendIds.includes(id));
  
    console.log('[EventDetail] Checking pending status for', toCheck);
  
    Promise.all(
      toCheck.map(async id => {
        try {
          const status = await checkFriendshipStatus(me.id, id);
          // si l'utilisateur a déjà envoyé une requête -> pending
          return status === 'already_sent' ? id : null;
        } catch (err) {
          console.error('[EventDetail] checkFriendshipStatus error for', id, err);
          return null;
        }
      })
    ).then(results => {
      const pendings = results.filter((x): x is string => x !== null);
      console.log('[EventDetail] Restored pendingRequests =', pendings);
      setPendingRequests(pendings);
    });
  }, [me, participants, friendIds]);

  // 4) Handlers Join / Quit
  const handleJoin = useCallback(async () => {
    console.log('[EventDetail] handleJoin called', { me, event });
    if (!me || !event) return;
    try {
      await participateUser(me.id, event.id);
      console.log('[EventDetail] participateUser success');
      await loadData();
    } catch (err) {
      console.error('[EventDetail] handleJoin error', err);
      alert('Erreur inscription !');
    }
  }, [me, event, loadData]);

  const handleQuit = useCallback(async () => {
    console.log('[EventDetail] handleQuit called', { me, event });
    if (!me || !event) return;
    try {
      await unsubscribeUser(me.id, event.id);
      console.log('[EventDetail] unsubscribeUser success');
      await loadData();
    } catch (err) {
      console.error('[EventDetail] handleQuit error', err);
      alert('Erreur désinscription !');
    }
  }, [me, event, loadData]);

  const handleSendRequest = useCallback(async (targetId: string) => {
    console.log('[EventDetail] handleSendRequest to', targetId);
    if (!me) return;
    try {
      await sendFriendRequest(me.id, targetId);
      console.log('[EventDetail] request sent, adding to pending');
      setPendingRequests(prev => [...prev, targetId]);
    } catch (err: any) {
      console.error('[EventDetail] sendFriendRequest error', err);
      // Essayer de parser la réponse JSON
      let body;
      try {
        body = JSON.parse(err.message.match(/– (.*)$/)?.[1] || '{}');
      } catch { body = null; }
      if (body?.reason === 'request already made') {
        console.log('[EventDetail] request already exists, marking pending');
        setPendingRequests(prev => [...prev, targetId]);
      } else {
        alert('Erreur envoi demande d\'ami');
      }
    }
  }, [me]);

  useEffect(() => {
  const loadNotes = async () => {
      if (!me || !event) return;
      try {
        const note: number = await fetchNote(event.id);
        console.log('[EventDetail] Restored note =', note);
        setNote(note);

        const now = new Date();
        const l = now.getTime() >= Date.parse(event.debut) && now.getTime() <= Date.parse(event.fin);
        setLive(l)
      } catch (err) {
        console.error('[EventDetail] fetchNotesByEventId error', err);
      }
    };

    loadNotes();
  }, [me, event]);
  
  

  // 5) Render loader if needed
  if (loadingMe || loadingData) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // 6) If me still null, show error
  if (!me) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <Text fontSize={16} textAlign="center">
          Impossible de charger votre profil. Veuillez vous reconnecter.
        </Text>
      </SafeAreaView>
    );
  }

  if (!event) {
    return <Text>Aucune soirée trouvée</Text>;
  }

  // --- UI preparations ---
  const truncatedTags = event.tags.map(t => truncateText(t, 6));
  const dateFull = new Date(event.debut).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const weekday = new Date(event.debut).toLocaleDateString('en-US', { weekday: 'long' });
  const timeStart = new Date(event.debut).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const timeEnd = new Date(event.fin).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const avatarUrls = participants.map(p => `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${p.photoProfil}`);
  const displayOrgName = organizer
    ? organizer.nom.length > 18
      ? organizer.nom.slice(0, 18) + '..'
      : organizer.nom
    : '';

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#fff' }}
      edges={['bottom']}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 * scale }}
      >
        {/* COVER + GRADIENT + PILL */}
        <YStack
          position="relative"
          width={screenWidth}
          height={182 * scale}
        >
          <Image
            position="absolute"
            top={0}
            left={0}
            source={{
              uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${event.photoCouverturePath}`,
            }}
            width={screenWidth}
            height={182 * scale}
            resizeMode="cover"
          />
          <LinearGradient
            position="absolute"
            left={0}
            right={0}
            bottom={0}
            height={60 * scale}
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
            start={[0, 0]}
            end={[0, 1]}
          />
          <YStack
            position="absolute"
            top={146 * scale}
            left={44 * scale}
            width={295 * scale}
            height={60 * scale}
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
            <XStack
              flex={1}
              height="100%"
              alignItems="center"
              justifyContent={avatarUrls.length ? "space-between" : "center"}
            >
              <Attendees avatars={avatarUrls} />

              {/* Petit bouton Join/Quit */}
              <Pressable onPress={isParticipating ? handleQuit : handleJoin}>
                <YStack
                  width={67 * scale}
                  height={28 * scale}
                  borderRadius={7 * scale}
                  backgroundColor={isParticipating ? '#fff' : '#FF3C78'}
                  borderWidth={isParticipating ? 1 : 0}
                  borderColor="#FF3C78"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    fontFamily="Raleway"
                    fontWeight="700"
                    fontSize={12 * scale}
                    color={isParticipating ? '#FF3C78' : '#fff'}
                  >
                    {isParticipating ? 'QUIT' : 'Join'}
                  </Text>
                </YStack>
              </Pressable>
            </XStack>
          </YStack>
        </YStack>

        {/* TITRE */}
        <YStack width={313 * scale} mx="auto" mt={38 * scale}>
          <Text fontFamily="Raleway" fontWeight="800" fontSize={35 * scale}>
            {event.nom}
          </Text>
        </YStack>

        {/* ORGANIZER + TAGS */}
        <XStack
          width={327 * scale}
          mx="auto"
          mt={10 * scale}
          alignItems="center"
          justifyContent="space-between"
        >
          {organizer && (
            <XStack alignItems="center">
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${organizer.photo}`,
                }}
                width={44 * scale}
                height={44 * scale}
                borderRadius={10 * scale}
              />
              <YStack ml={12.5 * scale}>
                <Text
                  fontFamily="Raleway"
                  fontWeight="600"
                  fontSize={15 * scale}
                  color="#1A1B41"
                >
                  {displayOrgName}
                </Text>
                <Text
                  fontFamily="Raleway"
                  fontWeight="400"
                  fontSize={12 * scale}
                  color="#1A1B41"
                  opacity={0.5}
                >
                  Organizer
                </Text>
              </YStack>
            </XStack>
          )}
          <YStack
            width={100 * scale}
            position="absolute"
            right={0}
            height={45 * scale}
          >
            {truncatedTags.map((txt, i) => {
              const w = 50 * scale, h = 13 * scale, g = 5 * scale;
              const col = i % 2, row = Math.floor(i / 2);
              return (
                <YStack
                  key={i}
                  position="absolute"
                  right={col * (w + g)}
                  top={row * (h + g)}
                  width={w}
                  height={h}
                  borderRadius={4 * scale}
                  backgroundColor="#8F00FF"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize={9 * scale} color="#fff">
                    {txt}
                  </Text>
                </YStack>
              );
            })}
          </YStack>
        </XStack>

        {/* SLIDERS */}
        <YStack mt={10 * scale} space={10 * scale} px={30 * scale}>
          {event.dancing != null && (
            <Slider
              title="Dancing"
              value={event.dancing}
              max={100}
              icon="💃"
              width={314 * scale}
              height={10 * scale}
            />
          )}
          {event.alcohool != null && (
            <Slider
              title="Alcohol"
              value={event.alcohool}
              max={100}
              icon="🍹"
              width={314 * scale}
              height={10 * scale}
            />
          )}
          {event.talking != null && (
            <Slider
              title="Talk"
              value={event.talking}
              max={100}
              icon="🗣️"
              width={314 * scale}
              height={10 * scale}
            />
          )}
        </YStack>

          {note && <XStack mt={10 * scale} px={30 * scale} alignItems='center'>
            
          <YStack
            width={48 * scale}
            height={48 * scale}
            borderRadius={12 * scale}
            backgroundColor="rgba(255,60,120,0.1)"
            alignItems="center"
            justifyContent="center"
          >
            <Star
              width={24 * scale}
              height={24 * scale}
              color="#FF3C78"
            />
          </YStack>
          <XStack alignItems="center" gap={20}>
          <YStack ml={14 * scale} justifyContent="center">
            <Text
              fontFamily="Raleway"
              fontWeight="700"
              fontSize={16 * scale}
              color="#FF3C78"
              opacity={0.84}
            >
              {Math.floor(note) + "/100"}
            </Text>
            </YStack>
            {live && <Button
              theme="red"
              size="$3"
              borderRadius="$8"
              paddingHorizontal="$4"
              alignItems='center'
              justifyContent='center'
              backgroundColor="$red10"
            >
              <XStack alignItems="center" space="$2">
                <Text fontWeight="700" color="white">LIVE</Text>
              </XStack>
            </Button>}
          </XStack>
            </XStack>
          }

        {/* DATE & TIME */}
        <XStack mt={10 * scale} px={30 * scale}>
          <YStack
            width={48 * scale}
            height={48 * scale}
            borderRadius={12 * scale}
            backgroundColor="rgba(255,60,120,0.1)"
            alignItems="center"
            justifyContent="center"
          >
            <CalendarDays
              width={24 * scale}
              height={24 * scale}
              color="#FF3C78"
            />
          </YStack>
          <YStack ml={14 * scale} justifyContent="center">
            <Text
              fontFamily="Raleway"
              fontWeight="600"
              fontSize={16 * scale}
              color="#1A1B41"
              opacity={0.84}
            >
              {dateFull}
            </Text>
            <Text
              fontFamily="Raleway"
              fontWeight="400"
              fontSize={12 * scale}
              color="#747688"
            >
              {`${weekday}, ${timeStart} - ${timeEnd}`}
            </Text>
          </YStack>
        </XStack>

        {/* LOCATION */}
        <XStack mt={20 * scale} px={30 * scale}>
          <YStack
            width={48 * scale}
            height={48 * scale}
            borderRadius={12 * scale}
            backgroundColor="rgba(255,60,120,0.1)"
            alignItems="center"
            justifyContent="center"
          >
            <MapPinned
              width={24 * scale}
              height={24 * scale}
              color="#FF3C78"
            />
          </YStack>
          <YStack ml={14 * scale} justifyContent="center">
            <Text
              fontFamily="Raleway"
              fontWeight="600"
              fontSize={16 * scale}
              color="#1A1B41"
              opacity={0.84}
            >
              {location?.nom ?? 'Unknown'}
            </Text>
            <Text
              fontFamily="Raleway"
              fontWeight="400"
              fontSize={12 * scale}
              color="#747688"
            >
              {location?.adresse ?? ''}
            </Text>
          </YStack>
        </XStack>

        {/* TABS */}
        <XStack
          mt={20 * scale}
          px={16 * scale}
          height={40 * scale}
          alignItems="center"
          justifyContent="center"
          elevation={3}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4 * scale}
        >
          <Pressable onPress={() => setSelectedTab('About')}>
            <Text
              fontFamily="Raleway"
              fontWeight="700"
              fontSize={16 * scale}
              color={selectedTab === 'About' ? '#FF3C78' : '#747688'}
            >
              About
            </Text>
          </Pressable>
          <YStack
            width={1 * scale}
            height={20 * scale}
            backgroundColor="#1A1B41"
            opacity={0.25}
            mx={10 * scale}
          />
          <Pressable onPress={() => setSelectedTab('People')}>
            <Text
              fontFamily="Raleway"
              fontWeight="700"
              fontSize={16 * scale}
              color={selectedTab === 'People' ? '#FF3C78' : '#747688'}
            >
              People
            </Text>
          </Pressable>
        </XStack>

        {/* TAB CONTENT */}
        <YStack px={16 * scale} mt={10 * scale}>
          {selectedTab === 'About' ? (
            <>
              <Text
                fontFamily="Raleway"
                fontWeight="600"
                fontSize={18 * scale}
                color="#1A1B41"
                opacity={0.84}
                mb={8 * scale}
              >
                About Event
              </Text>
              <Text
                fontFamily="Raleway"
                fontWeight="500"
                fontSize={16 * scale}
                color="#747688"
                lineHeight={22 * scale}
              >
                {event.description}
              </Text>
            </>
          ) : (
            sortedParticipants.map(p => (
              <Pressable
              key={p.id}
              onPress={() => {
                console.log('[EventDetail] navigate to profile of', p.id);
                router.push({
                  pathname: '/userprofile/[id]', 
                  params: { id: p.id },
                });
              }}
              style={{ marginVertical: 4 * scale }}
              >
              
              <XStack
                key={p.id}
                width={327 * scale}
                height={40 * scale}
                mx="auto"
                my={4 * scale}
                borderRadius={10 * scale}
                backgroundColor="#fff"
                px={10 * scale}
                elevation={2}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.08}
                shadowRadius={3 * scale}
                alignItems="center"
              >
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${p.photoProfil}`,
                  }}
                  width={30 * scale}
                  height={30 * scale}
                  borderRadius={15 * scale}
                />
                <Text
                  ml={10 * scale}
                  fontFamily="Raleway"
                  fontWeight="700"
                  fontSize={12 * scale}
                  color="#1A1B41"
                >
                  {p.pseudo}
                </Text>
                <YStack ml="auto">
                  {p.id === me.id ? (
                    /* 1. Moi -> “Me” */
                    <Text color="#FF3C78" fontWeight="700">Me</Text>
                  ) : friendIds.includes(p.id) ? (
                    /* 2. Ami -> “Your Friend” blanc/rose */
                    <YStack borderWidth={1} borderColor="#FF3C78" borderRadius={7 * scale} px={8} py={2}>
                      <Text color="#FF3C78" fontWeight="700">Your Friend</Text>
                    </YStack>
                  ) : pendingRequests.includes(p.id) ? (
                    /* 3. En attente -> “Pending...” gris/blanc */
                    <YStack backgroundColor="#ccc" borderRadius={7 * scale} px={8} py={2}>
                      <Text color="#fff" fontWeight="700">Pending...</Text>
                    </YStack>
                  ) : (
                    /* 4. Pas ami -> bouton cliquable */
                    <Pressable onPress={() => handleSendRequest(p.id)}>
                      <YStack backgroundColor="#FF3C78" borderRadius={7 * scale} px={8} py={2}>
                        <Text color="#fff" fontWeight="700">Request Friend</Text>
                      </YStack>
                    </Pressable>
                  )}
                </YStack>
              </XStack>
              </Pressable>
            ))
          )}
        </YStack>
      </ScrollView>

      {/* GRAND BOUTON “JOIN THE PARTY” */}
      {!isParticipating && (
        <Pressable
          onPress={handleJoin}
          style={{
            position: 'absolute',
            bottom: 16 * scale,
            left: (screenWidth - 271 * scale) / 2,
          }}
        >
          <XStack
            width={271 * scale}
            height={58 * scale}
            borderRadius={10 * scale}
            backgroundColor="#FF3C78"
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
            elevation={4}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.2}
            shadowRadius={4 * scale}
          >
            <Text
              fontFamily="Raleway"
              fontWeight="700"
              fontSize={16 * scale}
              color="#fff"
            >
              JOIN THE PARTY
            </Text>
            <ArrowRightCircle
              size={30 * scale}
              color="#fff"
              style={{ marginLeft: 8 * scale }}
            />
          </XStack>
        </Pressable>
      )}

      {/* BOUTON RETOUR FIXE */}
      <Pressable
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 40 * scale,
          left: 16 * scale,
          zIndex: 10,
          padding: 8,
        }}
      >
        <ChevronLeftCircle
          color="#fff"
          width={24 * scale}
          height={24 * scale}
        />
      </Pressable>
    </SafeAreaView>
  );
}
