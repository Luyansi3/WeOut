import { convertURLWithParams } from '@/utils/convertURLWithParams';

export interface SignupData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export async function signUpUser(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string): Promise<void> {

    


    // Check if the username is already taken TO DO
    // Check if the email is already taken TO DO




    // Call API
    try {
        let url: string = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/users/signup`
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({firstName, lastName, username, email, password }),
        });
        if (!res.ok) throw new Error('Registration failed');
        alert('Registration successful! Please log in.');
    } catch (e) {
        alert('Registration error');
    }
}
