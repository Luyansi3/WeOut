import React, { useState } from 'react';
import { XStack, YStack, Text } from 'tamagui';

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

    return (
        <YStack flex={1} padding={24} backgroundColor={customColors.background}> {/* Pour mettre le Preferences a gauche ? */}
            <Text fontSize={28} fontWeight="700" marginBottom={8} color={customColors.textMain} >
                Preferences
            </Text>

            <YStack flex={1} space={10} padding={20} alignContent="center" width={"100%"} backgroundColor={customColors.background} borderRadius={20} elevation={2}>
                {/* Dancing slider */}
                <SlidingSlider
                    value={dancingValue} // default value to set the slider
                    max={100}
                    icon="💃​"
                    trackColor={customColors.sliderVide}
                    gradientFrom={customColors.purple}
                    gradientTo={customColors.pink}
                    circleSize={40} 
                    onValueChange={setDancingValue}/> {/* permet de récupérer la valeur modifié dans l'enfant et de la récupérer ici dans le comp parent */}
                    

                {/* Drink slider */}
                <SlidingSlider
                    value={drinkValue} // default value to set the slider
                    max={100}
                    icon="🍹​"
                    trackColor={customColors.sliderVide}
                    gradientFrom={customColors.purple}
                    gradientTo={customColors.pink}
                    circleSize={40} 
                    onValueChange={setDrinkValue}/>

                {/* Talk slider */}
                <SlidingSlider
                    value={talkValue} // default value to set the slider
                    max={100}
                    icon="🗣️​"
                    trackColor={customColors.sliderVide}
                    gradientFrom={customColors.purple}
                    gradientTo={customColors.pink}
                    circleSize={40} 
                    onValueChange={setTalkValue}/>

            </YStack>
        </YStack>
    );
}