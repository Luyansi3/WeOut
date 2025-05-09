import React, { useState, useRef, useEffect } from 'react';
import { XStack, YStack, Text } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { PanResponder } from 'react-native';

export interface SlidingSliderProps {
  /** Valeur courante (entre 0 et max) */
  value: number;
  /** Valeur maximum */
  max: number;
  /** Emoji ou composant à afficher dans le cercle */
  icon: string | React.ReactNode;
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
  /** Si vrai, on utilise un remplissage solide plutôt que le gradient */
  useSolidFill?: boolean;
  /** Couleur de remplissage solide (par défaut #32FFCE) */
  fillColor?: string;
  /** Diamètre du cercle icône (par défaut 26) */
  circleSize?: number;
  /** Callback quand la valeur change */
  onValueChange?: (value: number) => void;
}

export const calculateValueFromPageX = (pageX: number, trackX: number, width: number, max: number) => {
  const relativeX = pageX - trackX;
  const clampedX = Math.max(0, Math.min(width, relativeX));
  return Math.round((clampedX / width) * max);
};

const SlidingSlider: React.FC<SlidingSliderProps> = ({
  value,
  max,
  icon,
  width = 314,
  height = 10,
  trackColor = '#E0E0E0',
  gradientFrom = '#FF3C78',
  gradientTo = '#8F00FF',
  useSolidFill = false,
  fillColor = '#32FFCE',
  circleSize,
  onValueChange,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [trackX, setTrackX] = useState(0);
  const size = circleSize ?? 26;

  // Sync internal state when controlled
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Calculate fill width based on internalValue
  const fillWidth = Math.max(0, Math.min(1, internalValue / max)) * width;

  // PanResponder to handle drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gs) => handlePan(evt.nativeEvent.pageX),
      onPanResponderMove: (evt, gs) => handlePan(evt.nativeEvent.pageX),
      onPanResponderRelease: () => {},
    })
  ).current;

  // Calculate and set new value based on gesture X
  const handlePan = (pageX: number) => {
    const newValue = calculateValueFromPageX(pageX, trackX, width, max);
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <XStack
      testID="slider-container"
      position="relative"
      width={width}
      height={size}
      alignItems="center"
      overflow="visible"
      // Measure track X offset
      onLayout={e => setTrackX(e.nativeEvent.layout.x)}
    >
      {/* Track vide */}
      <XStack
        position="absolute"
        left={0}
        top={(size - height) / 2}
        width={width}
        height={height}
        borderRadius={height / 2}
        backgroundColor={trackColor}
      />

      {/* Remplissage coloré ou gradient */}
      {useSolidFill ? (
        <XStack
          position="absolute"
          left={0}
          top={(size - height) / 2}
          width={fillWidth}
          height={height}
          borderRadius={height / 2}
          backgroundColor={fillColor}
        />
      ) : (
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
      )}

      {/* Cercle draggable aligné sur fin de remplissage */}
      <YStack
        testID="slider-thumb"
        position="absolute"
        left={fillWidth - size / 2}
        top={0}
        width={size}
        height={size}
        borderRadius={size / 2}
        backgroundColor="#FFFFFF"
        alignItems="center"
        justifyContent="center"
        elevation={2}
        zIndex={10}
        {...panResponder.panHandlers}
      >
        {typeof icon === 'string' ? (
          <Text fontSize={size * 0.6}>{icon}</Text>
        ) : (
          icon
        )}
      </YStack>
    </XStack>
  );
};

export default SlidingSlider;
