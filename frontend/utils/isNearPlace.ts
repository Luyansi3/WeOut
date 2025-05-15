import * as Location from 'expo-location';
import { getDistanceInMeters } from './getDistance';
import { LocationResponse } from '@/types/Location';

export const isNearPlace = async (place: LocationResponse): Promise<number> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const distance = getDistanceInMeters(
      latitude,
      longitude,
      place.latitude,
      place.longitude
    );

    return distance;
  } catch (error) {
    throw error;
  }
};
