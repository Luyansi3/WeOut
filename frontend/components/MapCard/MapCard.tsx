import { MAP_CARD_HEIGHT } from "@/app/(tabs)/map";
import { EventCardProps } from "@/types/Event";
import { Calendar, ChevronDown, MapPin } from "@tamagui/lucide-icons";
import { Animated, TouchableWithoutFeedback, StyleSheet, Image, Text } from "react-native";
import { XStack, YStack } from "tamagui";

export default function MapCard({ slideAnim, selectedMarker, toggleCard}: { slideAnim: any, selectedMarker: any, toggleCard: any }) {
  return (
        <Animated.View style={[styles.card, { top: slideAnim }]}>
            <YStack
                gap={"$2"}
                width="100%"
            >
                <ChevronDown 
                    onPress={() => toggleCard(selectedMarker)}
                    style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
                <Image 
                    testID='EventImage'
                    source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${selectedMarker.image}` }}
                    style={{
                        borderRadius: 15,
                        overflow: 'hidden',
                        width: '100%',
                        height: '45%',
                        resizeMode: 'cover',
                        alignSelf: 'center',
                    }}
                />
                <Text 
                    style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                    }}
                >
                    {selectedMarker.title}
                </Text>
                <Text 
                    style={{
                        flexWrap: 'wrap',
                    }}
                >
                    {selectedMarker.description.slice(0, 100).length > 100 ? selectedMarker.description.slice(0, 100) + '...': selectedMarker.description.slice(0, 100)}
                </Text>
                
                <XStack
                    testID='EventDate'
                    gap={"$2"}
                    alignItems="flex-start">
                    
                    <Calendar width={20} height={20} color={"black"} />
                    <Text style={{ color: "gray"}}>{selectedMarker.date}</Text>
                </XStack>
                <XStack
                    testID='EventLocation'
                    gap={"$2"}
                    alignItems="flex-start">
                    <MapPin width={20} height={20} color={"black"} />
                    <Text style={{ color: "gray"}}>{selectedMarker.location}</Text>
                </XStack>
            </YStack>
        </Animated.View>)}

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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});