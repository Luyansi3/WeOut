// app/userprofile/index.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setMe } from '@/services/setMeService';

export default function MyProfileRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Va chercher et stocke user dans AsyncStorage ou redirige si pas de token
      await setMe(router);

      // Récupère l'user pour en extraire l'id
      const json = await AsyncStorage.getItem('user');
      const me = json ? JSON.parse(json) : null;

      if (me?.id) {
        // Redirige vers /userprofile/<me.id>
        router.replace(`/userprofile/${me.id}`);
      } else {
        // Pas de user => back to login
        router.replace('/login');
      }
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }
  return null;
}
