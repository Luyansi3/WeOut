import React from 'react';
import { XStack, YStack, Text } from 'tamagui';
import {LinearGradient } from 'tamagui/linear-gradient';

export interface SliderProps {
  /** Valeur courante (entre 0 et max) */
  value: number;
  /** Valeur maximum */
  max: number;
  /** Emoji ou composant à afficher dans le cercle */
  icon: string | React.ReactNode;
  /** Titre au-dessus de la barre */
  title?: string;
  /** Largeur de la barre track (par défaut 314) */
  width?: number;
  /** Hauteur de la barre track (par défaut 10) */
  height?: number;
  /** Couleur du track vide */
  trackColor?: string;
  /** Couleur de début de gradient */
  gradientFrom?: string;
  /** Couleur de fin de gradient */
  gradientTo?: string;
  /** Diamètre du cercle icône (par défaut 26) */
  circleSize?: number;
}

const Slider: React.FC<SliderProps> = ({
  value,
  max,
  icon,
  title,
  width = 314,
  height = 10,
  trackColor = '#E0E0E0',
  gradientFrom = '#FF3C78',
  gradientTo = '#8F00FF',
  circleSize,
}) => {
  const ratio = Math.max(0, Math.min(1, value / max));
  const fillWidth = ratio * width;
  const size = circleSize ?? 26;

  return (
    <YStack width={width} position="relative">
      {/* Title styling: 10px from left, 2px above bar, Raleway Regular 9px, color #1A1B41 at 50% */}
      {title && (
        <Text
          position="absolute"
          top={-5}
          left={10}
          fontFamily="Raleway"
          fontWeight="400"
          fontSize={9}
          color="#1A1B41"
          opacity={0.5}
        >
          {title}
        </Text>
      )}

      <XStack position="relative" width={width} height={size} alignItems="center" overflow="visible">
        {/* Track vide (gray background) */}
        <XStack
          position="absolute"
          left={0}
          top={(size - height) / 2}
          width={width}
          height={height}
          borderRadius={height / 2}
          backgroundColor={trackColor}
        />

        {/* Gradient de remplissage */}
        <LinearGradient
          colors={[gradientFrom, gradientTo]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            position: 'absolute',
            left: 0,
            top: (size - height) / 2,
            width: fillWidth,
            height,
            borderRadius: height / 2,
          }}
        />

        {/* Cercle icône fixe à droite de la barre */}
        <YStack
          position="absolute"
          left={width - size}
          top={(size - size) / 2}
          width={size}
          height={size}
          borderRadius={size / 2}
          backgroundColor="#FFFFFF"
          alignItems="center"
          justifyContent="center"
          elevation={2}
          zIndex={10}
        >
          {typeof icon === 'string' ? (
            <Text fontSize={size * 0.6}>{icon}</Text>
          ) : (
            icon
          )}
        </YStack>
      </XStack>
    </YStack>
  );
};

export default Slider;