import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export async function getMeService() {
    const router = useRouter();

    // Retrieve the token from AsyncStorage
    const token = AsyncStorage.getItem('token');
    if(!token) {
        router.replace('/login');
        return;
    }

    // API CALL:
    try{
        let url : string = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/users/me`;
        const res = await fetch(url,
            {
                method: 'GET',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
            }
        );
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        await AsyncStorage.setItem('user', JSON.stringify(data));
        console.log('User data loaded in AsyncStorage', data);        
    }
    catch (error) {
        console.error('Error during getMe:', error);
        alert('Error fetching user data');
    }
}