import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import * as Location from "expo-location";
import MapView, { Callout, Marker } from "react-native-maps";
import CustomMapButton from "@/components/CustomMapButton/CustomMapButton";
import { LocateFixed, Compass } from "@tamagui/lucide-icons";
import { EventResponse } from "@/types/Event";
import { LocationResponse } from "@/types/Location";
import { fetchLocationById } from "@/services/locationService";
import { fetchAllEvents } from "@/services/eventService";
import { LinearGradient } from "tamagui/linear-gradient";

const Map = () => {
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);
  const [events, setEvents] = useState([] as EventResponse[]);
  const [locations, setLocations] = useState([] as LocationResponse[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchEventsWithLocations = async () => {
          try {
          const eventsData = await fetchAllEvents({});
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
  }, []);

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
        {region && (
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={false}
        >
            {locations.map((location: LocationResponse, index) => {
              const event = events[index];
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                >
                  <LinearGradient
                    width={33}
                    height={33}
                    borderRadius={120}
                    colors={['#FF3C78', '#8F00FF']}
                    alignItems="center"
                    justifyContent="center"
                    p={1}
                  >
                    <View
                      width={29}
                      height={29}
                      borderRadius={50}
                      overflow="hidden"
                    >
                    <Image 
                      testID='EventImage'
                      alignSelf='center'
                      source={{ uri: `${process.env.EXPO_PUBLIC_BACKEND_URL_STATIC}/${event.photoCouverturePath}` }}
                      width="100%"
                      height="100%"
                      resizeMode="cover"
                    />
                    </View>
                  </LinearGradient>
                </Marker>
              )}
            )}
        </MapView>
        )}
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
