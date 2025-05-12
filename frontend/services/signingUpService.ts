export interface SignupData {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export async function signUpUser(data: SignupData): Promise<void> {
    if (!data.fullName || !data.username || !data.email || !data.password) {
      throw new Error('Please fill in all fields');
    }
    if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
    }
    try {
      let url: string = convertURLWithParams(`http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/soirees`, parameters);
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, email, password }),
      });
      if (!res.ok) throw new Error('Registration failed');
      alert('Registration successful! Please log in.');
      router.push('/login');
    } catch (e) {
      alert('Registration error');
    }


