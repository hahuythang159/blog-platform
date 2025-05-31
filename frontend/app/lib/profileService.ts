import { fetcher } from '@/app/utils/fetcher';
import { getAvatarUrl } from './avatarService';
import { getToken } from '../utils/token';
import { ProfileData } from '../types';

export const getProfile = async (): Promise<ProfileData | null> => {
    const token = getToken();
    try {
        const data = await fetcher('user/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const avatarUrl = await getAvatarUrl(data?.userId) || '';

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

export const updateProfile = async (profile: ProfileData): Promise<boolean> => {
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

