import React from 'react';
import { View, Text, XStack, Image, YStack } from 'tamagui';
import { MapPin, Calendar } from '@tamagui/lucide-icons';
import Attendees from '@/components/Attendees/Attendees';
import { EventCardProps } from '@/types/Event';

const EventCard = (props: EventCardProps & { avatars?: string[] }) => {
  const {
    image,
    title,
    description,
    date,
    location,
    avatars = [],
  } = props;

  return (
    <View
      width="100%"
      padding={15}
      borderRadius={18}
      alignItems="center"
      backgroundColor="white"
    >
      <YStack gap="$2" width="100%">
        {/* Cover */}
        <Image
          testID="EventImage"
          alignSelf="center"
          source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${image}` }}
          borderRadius={15}
          width="100%"
          height={200}
        />

        {/* Title & description */}
        <Text fontWeight={600} fontSize="$8">
          {title}
        </Text>
        <Text flexWrap="wrap">
          {description.length > 100 ? `${description.slice(0, 100)}…` : description}
        </Text>

        {/* Attendees (se rend nul si avatars.length === 0) */}
        <Attendees avatars={avatars} />

        {/* Date */}
        <XStack testID="EventDate" gap="$2" alignItems="flex-start">
          <Calendar width={20} height={20} color="black" />
          <Text color="gray">{date}</Text>
        </XStack>

        
        {/* Location */}
        <XStack testID="EventLocation" gap="$2" alignItems="flex-start">
          <MapPin width={20} height={20} color="black" />
          <Text color="gray">{location}</Text>
        </XStack>
      </YStack>
    </View>
  );
};

export default EventCard;
