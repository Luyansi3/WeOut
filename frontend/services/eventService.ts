import { EventResponse, SoireeParams } from '@/types/Event';
import { convertURLWithParams } from '@/utils/convertURLWithParams';

export const fetchEvents = async (parameters: SoireeParams): Promise<EventResponse[]> => {
  try {
    let url: string = convertURLWithParams(`http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/soirees`, parameters);
    console.log('Fetching events from:', url);
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const events: EventResponse[] = await response.json();
    console.log('Events fetched:', events);
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventsByName = async (name: string): Promise<EventResponse[]> => {
  try {
    const url = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/soirees/name/${name}`;
    console.log('Fetching events by name from:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.statusText}`);
    }
    const events: EventResponse[] = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching events by name:', error);
    throw error;
  }
}

export const fetchEventByUserId = async (userId: string): Promise<EventResponse[]> => {
  try {
    const url = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/soirees/getSoireesByUserId/${userId}`;
    console.log('Fetching events by user ID from:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.statusText}`);
    }
    const events: EventResponse[] = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching events by user ID:', error);
    throw error;
  }
}
/**
 * Récupère une seule soirée par son ID
 */
export const fetchEventById = async (
  id: string | number
): Promise<EventResponse> => {
  const url = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/soirees/${id}`;
  try {
    const response = await fetch(url);
    console.log('[eventService] fetchEventById status =', response.status);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Soirée ${id} introuvable (404)`);
      }
      throw new Error(`fetchEventById failed (${response.status})`);
    }
    const data: EventResponse = await response.json();
    console.log('[eventService] fetchEventById data =', data);
    return data;
  } catch (error) {
    console.error('[eventService] fetchEventById error =', error);
    throw error;
  }
};
