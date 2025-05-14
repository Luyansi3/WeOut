import AsyncStorage from '@react-native-async-storage/async-storage'; // npm install @react-native-async-storage/async-storage --legacy-peer-deps

// doc : https://react-native-async-storage.github.io/async-storage/docs/usage/


export async function logInUser(
    email: string,
    password: string
): Promise<void> {

    let user_data = {
        email: email,
        password: password
    };

    try {
        let url: string = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/users/signin`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user_data),
        });
        if (!res.ok) throw new Error('Login failed');
        const json = await res.json();
        const token = json.token;

        // Store the token in AsyncStorage
        await AsyncStorage.setItem('token', token);  
    } catch (e) {
        alert('Login error');
        await AsyncStorage.removeItem('token'); // remove token if console.error();
        
    }
}
