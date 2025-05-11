import React from 'react';
import { View, Text, XStack, Image, YStack } from "tamagui";
import { MapPin, Calendar } from '@tamagui/lucide-icons'
import { EventCardProps } from '@/types/Event';

const EventCard = (props: EventCardProps) => {
    return (
        <View
            width="100%"
            padding={15}
            borderRadius={18}
            alignItems='center'
            backgroundColor="white"
        >
            <YStack
                gap={"$2"}
                width="100%"
            >
                <Image 
                    testID='EventImage'
                    alignSelf='center'
                    source={props.image}
                    borderRadius={15}
                />

                <Text fontWeight={600} fontSize={"$8"}>{props.title}</Text>
                <Text flexWrap='wrap'>
                    {props.description.slice(0, 100).length > 100 ? props.description.slice(0, 100) + '...': props.description.slice(0, 100)}
                </Text>
                
                <XStack
                    testID='EventDate'
                    gap={"$2"}
                    alignItems="flex-start">
                    
                    <Calendar width={20} height={20} color={"black"} />
                    <Text color="gray">{props.date}</Text>
                </XStack>
                <XStack
                    testID='EventLocation'
                    gap={"$2"}
                    alignItems="flex-start">
                    <MapPin width={20} height={20} color={"black"} />
                    <Text color={"gray"}>{props.location}</Text>
                </XStack>
            </YStack>
            
        </View>
    );
}

export default EventCard;