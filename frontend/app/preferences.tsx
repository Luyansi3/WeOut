import React, { useState } from 'react';
import { XStack, YStack, Text } from 'tamagui';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

// Custom components:
import SlidingSlider from '@/components/SlidingSlider/SlidingSlider';




export default function Preferences() {
    const [dancingValue, setDancingValue] = useState(50);
    const [drinkValue, setDrinkValue] = useState(50);
    const [talkValue, setTalkValue] = useState(50);

    const customColors = {
        sliderVide: "#3D424A",

        background: "#F5F5F7",
        pink: "#FF3C78", // fin du slider
        purple: "#8F00FF", // debut du slider
        textSecond: "#747688",
        textMain: "#1A1B41"
    }

    const router = useRouter();

    return (
        <YStack flex={1} padding={24} backgroundColor={customColors.background}> {/* Pour mettre le Preferences a gauche ? */}
            <XStack alignItems="center" marginBottom={8}>
                <Pressable onPress={() => router.back()}>
                    <ArrowLeft size={24} color={customColors.textMain} />
                </Pressable>
                <Text fontSize={28} fontFamily={"Raleway-Bold"} marginLeft={8} color={customColors.textMain}>
                    Preferences
                </Text>
            </XStack>

            <YStack flex={1} space={10} padding={20} alignContent="center" width={"100%"} backgroundColor={customColors.background} borderRadius={20} elevation={2}>
                {/* Dancing slider */}
                <Text fontSize={20} marginBottom={8} color={customColors.textMain} fontFamily={"Raleway-Regular"} >
                    How much do you like dancing ?
                </Text>


                <SlidingSlider
                    value={dancingValue}
                    max={100}
                    icon="💃​"
                    trackColor={customColors.sliderVide}
                    gradientFrom={customColors.purple}
                    gradientTo={customColors.pink}
                    circleSize={40}
                    onValueChange={setDancingValue} />

                {/* le onvalueChange va récupérer la valeur du slider enfant pour update notre state défini dans le parent ici */}





                {/* Drink slider */}
                <Text fontSize={20} marginBottom={8} color={customColors.textMain} fontFamily={"Raleway-Regular"} >
                    How much do you drink
                    while partying ?
                </Text>
                <SlidingSlider
                    value={drinkValue}
                    max={100}
                    icon="🍹​"
                    trackColor={customColors.sliderVide}
                    gradientFrom={customColors.purple}
                    gradientTo={customColors.pink}
                    circleSize={40}
                    onValueChange={setDrinkValue} />





                {/* Talk slider */}
                <Text fontSize={20} marginBottom={8} color={customColors.textMain} fontFamily={"Raleway-Regular"} >
                    How much do you talk
                    while partying ?
                </Text>
                <SlidingSlider
                    value={talkValue}
                    max={100}
                    icon="🗣️​"
                    trackColor={customColors.sliderVide}
                    gradientFrom={customColors.purple}
                    gradientTo={customColors.pink}
                    circleSize={40}
                    onValueChange={setTalkValue} />

            </YStack>
        </YStack>
    );
}