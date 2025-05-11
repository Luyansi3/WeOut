import { EventResponse, EventParams } from '@/types/Event';
import { convertURLWithParams } from '@/utils/convertURLWithParams';

export const fetchEvents = async (parameters: EventParams): Promise<EventResponse> => {
  try {
    let url = convertURLWithParams(`http://${process.env.EXPO_PUBLIC_BACKEND_URL}/soirees`, parameters);
    console.log('Fetching events from:', url);
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};