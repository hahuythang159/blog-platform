import { fetcher } from '@/app/utils/fetcher';
import { getUserAvatarUrl } from './avatarService';
import { getToken } from '../utils/token';
import { ProfileData } from '../types';

/**
 * Fetch the current logged-in user's profile data from the backend.
 * Includes fetching the avatar URL separately.
 * @returns Promise resolving to ProfileData object or null if error occurs.
 */
export const getMyProfile = async (): Promise<ProfileData | null> => {
    const token = getToken();
    try {
        const data = await fetcher('user/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const avatarUrl = await getUserAvatarUrl(data?.userId) || '';

        return {
            bio: data.bio,
            avatar: avatarUrl,
            birthday: data.birthday?.split('T')[0] || '',
            gender: data.gender,
        };
    } catch (error) {
        alert('Failed to load profile. Please try again later.');
        return null;
    }
};

/**
 * Update the logged-in user's profile with new data.
 * Sends an authorized PUT request with profile payload.
 * @param profile - Profile data object containing updated user info
 * @returns Promise resolving to boolean indicating success or failure.
 */
export const updateMyProfile = async (profile: ProfileData): Promise<boolean> => {
    const token = getToken();
    try {
        await fetcher('user/update', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });
        return true;
    } catch (error) {
        alert('Failed to update profile. Please check your input and try again.');
        return false;
    }
};

/**
 * Sends a request to delete the currently logged-in user's account.
 * Requires a valid authorization token.
 * @returns Promise resolving to `true` if deletion is successful, `false` otherwise.
 */
export const deleteMyAccount = async (): Promise<boolean> => {
    const token = getToken();

    try {
        await fetcher('user/delete', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return true;
    } catch (error) {
        alert('Account deletion failed. Please try again later.');
        return false;
    }
};


