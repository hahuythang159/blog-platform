import { rawFetcher } from "../utils/fetcher";

// API call to upload Avatar
export const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const res = await rawFetcher('user/upload-avatar', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        return data?.url || '';
    } catch (err) {
        alert('Upload failed');
        return '';
    }
};
// API call to get user avatar
export const getAvatarUrl = async (userId: string): Promise<string> => {
    try {
        const response = await rawFetcher(`user/avatar/${userId}`, {
            method: 'GET',
        });

        const avatarBlob = await response.blob();
        return URL.createObjectURL(avatarBlob);
    } catch (error) {
        return '';
    }
};