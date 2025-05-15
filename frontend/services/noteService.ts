import { EventResponse, SoireeParams } from '@/types/Event';
import { convertURLWithParams } from '@/utils/convertURLWithParams';

export const fetchNote = async (id: number): Promise<number> => {
  try {
    let url: string = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/notes/getNote/${id}`;
    console.log('Fetching note from:', url);
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const events: number = await response.json();
    console.log('Events fetched:', events);
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};