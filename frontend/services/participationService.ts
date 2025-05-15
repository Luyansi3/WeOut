import { convertURLWithParams } from "@/utils/convertURLWithParams";

// services/participationService.ts
const API_BASE = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}`;

export async function participateUser(userId: string, partyId: number): Promise<void> {
  const url = convertURLWithParams(`${API_BASE}/users/participate/${userId}`, { partyId : partyId });
  console.log('POST', url, 'body=', { partyId });

  const res = await fetch(url + `?partyId=${partyId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`participateUser failed (${res.status}) – ${text}`);
  }
}

export async function unsubscribeUser(userId: string, partyId: number): Promise<void> {
  // on passe partyId dans la query param nommée "id"
  const url = `${API_BASE}/users/unsubscribeFromEvent/${userId}?id=${partyId}`;
  console.log(`[unsubscribeUser] POST ${url}`);
  const res = await fetch(url, {
    method: 'POST',  // <–– c’est un POST, pas PATCH
  });
  const text = await res.text();
  console.log(`[unsubscribeUser] response status=${res.status}, body=`, text);
  if (!res.ok) {
    throw new Error(`unsubscribeUser failed (${res.status}) – ${text}`);
  }
}