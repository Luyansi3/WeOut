import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import CustomMapButton from "@/components/CustomMapButton/CustomMapButton";
import { LocateFixed, Compass } from "@tamagui/lucide-icons";

const Map = () => {
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);

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
        />
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
