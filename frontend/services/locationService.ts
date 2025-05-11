import { LocationResponse } from '@/types/Location';

export const fetchLocationById = async (loc: string): Promise<LocationResponse> => {
  try {
    let url: string = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/lieux/${loc}`;
    console.log('Fetching location by id from:', url);
    const response = await fetch(url);
    const location: LocationResponse = await response.json();
    return location;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};