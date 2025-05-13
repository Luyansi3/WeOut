import { UserProfileResponse } from "@/types/UserProfile";

export const fetchUserProfile = async (userId: string): Promise<any> => {
    try {
        let url: string = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/users/${userId}`;
        console.log('Fetching user profile from:', url);
        const response = await fetch(url);
        const userProfile: UserProfileResponse[] = await response.json();
        console.log('User profile fetched:', userProfile);
        if (!response.ok) {
            throw new Error(`Error fetching user profile: ${response.statusText}`);
        }
        if (userProfile.length === 0) {
            throw new Error('User profile not found');
        }

        return userProfile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const fetchUserFriends = async (userId: string): Promise<any> => {
    try {
        let url: string = `http://${process.env.EXPO_PUBLIC_BACKEND_URL_API}/users/getListFriends/${userId}`;
        console.log('Fetching user friends from:', url);
        const response = await fetch(url);
        const userFriends: UserProfileResponse[] = await response.json();
        console.log('User friends fetched:', userFriends.length);
        if (!response.ok) {
            throw new Error(`Error fetching user friends: ${response.statusText}`);
        }
        if (userFriends.length === 0) {
            throw new Error('User friends not found');
        }

        return userFriends;
    } catch (error) {
        console.error('Error fetching user friends:', error);
        throw error;
    }
}