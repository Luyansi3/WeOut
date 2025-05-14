// services/participantService.ts
import { Participant } from '@/types/Participant';
export const fetchParticipantsByEventId = async (
  id: string | number
): Promise<Participant[]> => {
  const res = await fetch(
    `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/soirees/participants/${id}`
  );
  if (!res.ok) throw new Error(`fetchParticipants failed (${res.status})`);
  const { participants } = await res.json();
  return participants as Participant[];
};

