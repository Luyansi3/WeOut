// services/friendService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}`;

/**
 * Récupère la liste des amis pour un utilisateur donné.
 * @param userId l'ID de l'utilisateur connecté
 * @returns Promise<string[]> tableau d'IDs d'amis
 */
export async function getListFriends(userId: string): Promise<string[]> {
  console.log('[FriendService] GET /users/getListFriends for', userId);
  const token = await AsyncStorage.getItem('token');
  const res = await fetch(`${API_BASE}/users/getListFriends/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[FriendService] getListFriends failed', res.status, text);
    throw new Error(`getListFriends failed (${res.status}) – ${text}`);
  }
  const data = await res.json();
  console.log('[FriendService] friends data', data);
  // On suppose que l'API renvoie un tableau d'objets { id: string, ... }
  return data.map((u: any) => u.id);
}

/**
 * Envoie une demande d'ami du sender vers le receiver.
 * @param senderId l'ID de l'utilisateur qui envoie la demande
 * @param receiverId l'ID de l'utilisateur destinataire
 */
export async function sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
    console.log('[FriendService] POST /users/sendFriendRequest from', senderId, 'to', receiverId);
    const token = await AsyncStorage.getItem('token');
    const url = `${API_BASE}/users/sendFriendRequest/${senderId}?receiverId=${receiverId}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',      // <<< ajouté
      },
      body: JSON.stringify({}),                  // <<< nouveau corps vide
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[FriendService] sendFriendRequest failed', res.status, text);
      throw new Error(`sendFriendRequest failed (${res.status}) – ${text}`);
    }
    console.log('[FriendService] sendFriendRequest success');
  }
  
  /** Vérifie le statut de relation entre activeId et passiveId */
  export async function checkFriendshipStatus(activeId: string, passiveId: string): Promise<string> {
    const url = `${API_BASE}/users/friendhsipStatus/${activeId}?id=${passiveId}`;
    console.log('[FriendService] GET', url);
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[FriendService] checkFriendshipStatus failed', res.status, text);
      throw new Error(`checkFriendshipStatus failed (${res.status}) – ${text}`);
    }
    const status = await res.json();
    console.log('[FriendService] checkFriendshipStatus →', status);
    return status as string;
  }