// components/Attendees/Attendees.tsx
import React from 'react';
import { XStack, Image, Text, YStack } from 'tamagui';

export type AttendeesProps = {
  /** Liste des URLs des avatars des participants (dans l'ordre d'affichage) */
  avatars: string[];
};

export default function Attendees({ avatars }: AttendeesProps) {
  const count = avatars.length;
  const displayed = avatars.slice(0, 3);
  const overlap = -12;

  return (
    <YStack alignItems="flex-start">
      <XStack alignItems="center" justifyContent="flex-start">
        {displayed.map((uri, idx) => {
          // on inverse l’ordre de zIndex pour que l’avatar de gauche soit au-dessus
          const z = displayed.length - idx;
          return (
            <Image
              key={idx}
              source={{ uri }}
              width={34.18}
              height={34.18}
              borderRadius={999}
              borderWidth={2}
              borderColor="#fff"
              ml={idx === 0 ? 0 : overlap}
              zIndex={z}
            />
          );
        })}

        {count > 3 && (
          <Text
            ml={8}
            fontFamily="Raleway"
            fontWeight="700"
            fontSize={15}
            color="#8F00FF"
          >
            +{count - 3} Going
          </Text>
        )}
      </XStack>
    </YStack>
  );
}