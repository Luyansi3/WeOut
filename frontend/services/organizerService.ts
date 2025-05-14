// src/services/organizerService.ts
import { Organizer } from '@/types/Organizer';

const API_BASE = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/orgas`;

export async function fetchOrgaByEventId(eventId: string): Promise<Organizer> {
  const url = `${API_BASE}/getOrgaBySoireeId/${eventId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`fetchOrgaByEventId failed (${res.status})`);
  }
  const data = await res.json();
  // La réponse contient { organsime: {...} }
  return data.organsime;
}