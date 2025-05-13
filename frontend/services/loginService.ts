import AsyncStorage from '@react-native-async-storage/async-storage'; // npm install @react-native-async-storage/async-storage --legacy-peer-deps

// doc : https://react-native-async-storage.github.io/async-storage/docs/usage/


export async function loginUser(
    email: string,
    password: string
): Promise<void> {
    try {
        let url: string = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/users/login`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        // TO DO MODIFY FOLLOWING:
        // const token = data.token; 
        // await AsyncStorage.setItem('token', token);
        // suite...
    } catch (e) {
        alert('Login error');
    }
}
