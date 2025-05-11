import { EventResponse, AllEventParams } from '@/types/Event';
import { convertURLWithParams } from '@/utils/convertURLWithParams';

export const fetchAllEvents = async (parameters: AllEventParams): Promise<EventResponse[]> => {
  try {
    let url: string = convertURLWithParams(`http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/soirees`, parameters);
    console.log('Fetching events from:', url);
    const response = await fetch(url);
    const events: EventResponse[] = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

