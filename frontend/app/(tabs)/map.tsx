import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Animated, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import * as Location from "expo-location";
import { Image } from "tamagui";
// import MapView, { Callout, Marker } from "react-native-maps";
import CustomMapButton from "@/components/CustomMapButton/CustomMapButton";
import { LocateFixed, Compass } from "@tamagui/lucide-icons";
import { EventResponse, SoireeParams } from "@/types/Event";
import { LocationResponse } from "@/types/Location";
import { fetchLocationById } from "@/services/locationService";
import { fetchEvents } from "@/services/eventService";
import { LinearGradient } from "tamagui/linear-gradient";
import MapCard from "@/components/MapCard/MapCard";
import MapBar from "@/components/MapBar/MapBar";

const { height } = Dimensions.get('window');
export const MAP_CARD_HEIGHT = 0.45 * height;

const Map = () => {
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);
  const [events, setEvents] = useState([] as EventResponse[]);
  const [locations, setLocations] = useState([] as LocationResponse[]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date() as Date);
  const [tags, setTags] = useState([] as string[]);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [markerData, setMarkerData] = useState();

  const toggleCard = (markerData: any) => {
    const isSameMarker = selectedMarker?.id === markerData.id;
    setMarkerData(markerData);
    const coords = {
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
      latitude: markerData.coords.latitude,
      longitude: markerData.coords.longitude,
    };
    if (mapRef.current) {
      mapRef.current.animateToRegion(coords, 1000); // 1s animation
    }

    if (isSameMarker || selectedMarker) {
      // Slide down and deselect
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        setSelectedMarker(null);
      });
    } else {
      // Slide up and show new marker
      setSelectedMarker(markerData);
      Animated.timing(slideAnim, {
        toValue: height - MAP_CARD_HEIGHT,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  /* useEffect(() => {
      const fetchEventsWithLocations = async () => {
          try {
          const eventsData = await fetchEvents({});
          setEvents(eventsData);

          const locationPromises = eventsData.map((event) =>
              fetchLocationById(event.lieuId)
          );

          const locationsData = await Promise.all(locationPromises);
          setLocations(locationsData);
          } catch (err) {
          console.log("Error fetching events or locations:", err);
          } finally {
          setLoading(false);
          }
      };

      fetchEventsWithLocations();
  }, []); */

  const fetchEventsByDateAndTagsWithLocations = async () => {
      try {
        const start = date
        start.setHours(7, 0, 0, 0)
        const end = new Date(start)
        end.setDate(start.getDate() + 1)
        const parameters: SoireeParams = {
            from: start,
            to: end,
            isStrictTag: true,
            tags: tags,
        }
        console.log("parameters", parameters)
      const eventsData = await fetchEvents(parameters);
      setEvents(eventsData);

      const locationPromises = eventsData.map((event) =>
          fetchLocationById(event.lieuId)
      );

      const locationsData = await Promise.all(locationPromises);
      setLocations(locationsData);
      } catch (err) {
      console.log("Error fetching events or locations:", err);
      } finally {
      setLoading(false);
      }
  };

  useEffect(() => {
      fetchEventsByDateAndTagsWithLocations();
  }, [date, tags]);

  const setLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    setRegion(newRegion);

    // Animate map view to new region
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000); // 1s animation
    }
  };

  const resetToNorth = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera({ heading: 0 }, { duration: 1000 });
    }
  };

  useEffect(() => {
    setLocation();
  }, []);

  return (
    <View style={styles.container}>
        <CustomMapButton 
            onPress={setLocation} 
            Icon={LocateFixed}
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
            }}
        />
        <CustomMapButton 
            onPress={resetToNorth} 
            Icon={Compass}
            style={{
              position: 'absolute',
              top: 110,
              right: 20,
            }}
        />
        
        
        {!selectedMarker && <MapBar 
          date={date}
          setDate={setDate}
          tags={tags}
          setTags={setTags}
        />}
        {selectedMarker && <TouchableWithoutFeedback>
          <MapCard 
            slideAnim={slideAnim} 
            selectedMarker={selectedMarker} 
            toggleCard={toggleCard}
          />
        </TouchableWithoutFeedback>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  }
});

export default Map;
