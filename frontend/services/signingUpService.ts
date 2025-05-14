import { convertURLWithParams } from '@/utils/convertURLWithParams';


export async function signUpUser(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string): Promise<void> {

    let user_data = {
        firstname: firstName,
        lastname: lastName,
        username: username,
        email: email,
        password: password
    };




    // Call API
    try {
        let url: string = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/users/signup`
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user_data),
        });
        if (!res.ok) throw new Error('Registration failed');
        
    } catch (e) {
        console.error('Error during signup:', e);
        alert('Registration error');
    }
}
