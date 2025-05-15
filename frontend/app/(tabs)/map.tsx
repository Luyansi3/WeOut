import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { Image } from 'tamagui';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'tamagui/linear-gradient';
import { useRouter } from 'expo-router';

import CustomMapButton from '@/components/CustomMapButton/CustomMapButton';
import { LocateFixed, Compass } from '@tamagui/lucide-icons';

import { EventResponse, SoireeParams } from '@/types/Event';
import { LocationResponse } from '@/types/Location';

import { fetchLocationById } from '@/services/locationService';
import { fetchEvents } from '@/services/eventService';
import { fetchParticipantsByEventId } from '@/services/participantService';

import MapCard from '@/components/MapCard/MapCard';
import MapBar from '@/components/MapBar/MapBar';

const { height } = Dimensions.get('window');
export const MAP_CARD_HEIGHT = 0.9 * height;

const Map = () => {
  const router = useRouter();

  const [region, setRegion] = useState<any>(null);
  const mapRef = useRef<MapView>(null);

  const [events, setEvents] = useState<EventResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState<Date>(new Date());
  const [tags, setTags] = useState<string[]>([]);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const [selectedMarker, setSelectedMarker] = useState<null | any>(null);

  /* --------- fetch events + lieux selon filtres --------- */
  const fetchEventsWithLocations = async () => {
    try {
      setLoading(true);

      const start = new Date(date);
      start.setHours(7, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      const params: SoireeParams = {
        from: start,
        to: end,
        isStrictTag: true,
        tags,
      };

      const evts = await fetchEvents(params);
      setEvents(evts);

      const locs = await Promise.all(evts.map(e => fetchLocationById(e.lieuId)));
      setLocations(locs);
    } catch (err) {
      console.error('Error fetch events/locs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsWithLocations();
  }, [date, tags]);

  /* ---------------- localisation user ------------------- */
  const setLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return console.warn('Location permission denied');

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const reg = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setRegion(reg);
    mapRef.current?.animateToRegion(reg, 1000);
  };

  useEffect(() => {
    setLocation();
  }, []);

  const resetToNorth = () =>
    mapRef.current?.animateCamera({ heading: 0 }, { duration: 1000 });

  /* ------------- ouvrir / fermer la carte --------------- */
  const toggleCard = (markerData: any) => {
    const same = selectedMarker?.id === markerData.id;

    mapRef.current?.animateToRegion(
      {
        latitude: markerData.coords.latitude,
        longitude: markerData.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000
    );

    if (same || selectedMarker) {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setSelectedMarker(null));
    } else {
      setSelectedMarker(markerData);
      Animated.timing(slideAnim, {
        toValue: height - MAP_CARD_HEIGHT,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  /* ----------------------------- render --------------------------- */
  return (
    <View style={styles.container}>
      <CustomMapButton
        onPress={setLocation}
        Icon={LocateFixed}
        style={{ position: 'absolute', top: '6%', right: 20 }}
      />
      <CustomMapButton
        onPress={resetToNorth}
        Icon={Compass}
        style={{ position: 'absolute', top: '13%', right: 20 }}
      />

      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
          provider="google"
        >
          {locations.map((loc, idx) => {
            const event = events[idx];
            if (!event || !loc) return null;

            const handlePress = async () => {
              console.log('[Map] Marker pressed id=', event.id);
              let avatars: string[] = [];
              try {
                const parts = await fetchParticipantsByEventId(event.id);
                avatars = parts.map(
                  p =>
                    `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${p.photoProfil}`
                );
              } catch (e) {
                console.error('participants fetch failed', e);
              }

              toggleCard({
                id: event.id,
                coords: { latitude: loc.latitude, longitude: loc.longitude },
                image: event.photoCouverturePath,
                title: event.nom,
                description: event.description,
                date: new Date(event.debut)
                  .toLocaleDateString()
                  .replace(/-/g, '/'),
                location: loc.adresse,
                avatars,
              });
            };

            return (
              <Marker
                key={event.id}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                onPress={handlePress}
              >
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    width={33}
                    height={33}
                    borderRadius={120}
                    colors={['#FF3C78', '#8F00FF']}
                    alignItems="center"
                    justifyContent="center"
                    p={1}
                  >
                    <View
                      width={29}
                      height={29}
                      borderRadius={50}
                      overflow="hidden"
                    >
                      <Image
                        source={{
                          uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${event.photoCouverturePath}`,
                        }}
                        width="100%"
                        height="100%"
                        resizeMode="cover"
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Marker>
            );
          })}
        </MapView>
      )}

      {!selectedMarker && (
        <MapBar
          date={date}
          setDate={setDate}
          tags={tags}
          setTags={setTags}
        />
      )}
      {selectedMarker && (
        <MapCard
          slideAnim={slideAnim}
          selectedMarker={selectedMarker}
          toggleCard={toggleCard}
          onNavigate={() => {
            console.log('[Map] navigate to /events/', selectedMarker.id);
            router.push(`/events/${selectedMarker.id}`);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  map: { width: '100%', height: '100%' },
});

export default Map;