import React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  GestureResponderEvent,
} from 'react-native';
import { XStack, YStack } from 'tamagui';
import { Calendar, MapPin, ChevronDown } from '@tamagui/lucide-icons';

import Attendees from '@/components/Attendees/Attendees';
import { MAP_CARD_HEIGHT } from '@/app/(tabs)/map';

type MarkerData = {
  id: string | number;
  coords: { latitude: number; longitude: number };
  image: string;
  title: string;
  description: string;
  date: string;
  location: string;
  avatars?: string[];
};

type Props = {
  slideAnim: Animated.Value;
  selectedMarker: MarkerData;
  toggleCard: (marker: MarkerData) => void;
  onNavigate: () => void;
};

export default function MapCard({
  slideAnim,
  selectedMarker,
  toggleCard,
  onNavigate,
}: Props) {
  const avatars = Array.isArray(selectedMarker.avatars)
    ? selectedMarker.avatars
    : [];

  const stop = (e: GestureResponderEvent) => e.stopPropagation();

  return (
    <Animated.View style={[styles.card, { top: slideAnim }]}>
      {/* la zone pressable englobe tout le contenu */}
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          console.log('[MapCard] onPress – navigate to', selectedMarker.id);
          onNavigate();
        }}
      >
        <YStack gap="$2" width="100%">
          <ChevronDown
            onPress={e => {
              stop(e);
              toggleCard(selectedMarker);
            }}
            style={{ alignSelf: 'center' }}
          />

          <Image
            source={{
              uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${selectedMarker.image}`,
            }}
            style={{
              borderRadius: 15,
              overflow: 'hidden',
              width: '100%',
              height: '45%',
              resizeMode: 'cover',
              alignSelf: 'center',
            }}
          />

          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
            {selectedMarker.title}
          </Text>

          <Text style={{ flexWrap: 'wrap' }}>
            {selectedMarker.description.length > 100
              ? selectedMarker.description.slice(0, 100) + '…'
              : selectedMarker.description}
          </Text>

          <Attendees avatars={avatars} />

          <XStack gap="$2" alignItems="flex-start">
            <Calendar width={20} height={20} color="black" />
            <Text style={{ color: 'gray' }}>{selectedMarker.date}</Text>
          </XStack>

          <XStack gap="$2" alignItems="flex-start">
            <MapPin width={20} height={20} color="black" />
            <Text style={{ color: 'gray' }}>{selectedMarker.location}</Text>
          </XStack>
        </YStack>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: MAP_CARD_HEIGHT,
    backgroundColor: '#F5F5F7',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    width: '100%',
    zIndex: 999,
  },
});