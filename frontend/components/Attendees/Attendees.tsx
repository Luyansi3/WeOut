// components/Attendees/Attendees.tsx
import React from 'react';
import { XStack, Image, Text, YStack } from 'tamagui';

export type AttendeesProps = {
  /** Liste des URLs des avatars des participants (dans l'ordre d'affichage) */
  avatars: string[];
};

export default function Attendees({ avatars }: AttendeesProps) {
  const count = avatars.length;
  // On n'affiche que les 3 premiers avatars
  const displayed = avatars.slice(0, 3);
  // Décalage horizontal pour le chevauchement
  const overlap = -12;

  return (
    <YStack width="100%" alignItems="center">
      <XStack alignItems="center" justifyContent={count <= 3 ? 'center' : 'flex-start'}>
        {displayed.map((uri, idx) => (
          <Image
            key={idx}
            source={{ uri }}
            width={34.18}
            height={34.18}
            borderRadius={999}
            ml={idx === 0 ? 0 : overlap}
            zIndex={idx + 1}
          />
        ))}

        {count > 3 && (
          <Text
            ml={12}
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