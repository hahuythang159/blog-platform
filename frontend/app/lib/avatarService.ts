import { rawFetcher } from "../utils/fetcher";

/**
 * Uploads a user's avatar image file to the server.
 * Sends a POST request with multipart/form-data.
 * @param file - The avatar image file to upload
 * @returns Promise resolving to the uploaded image URL as a string, or empty string if failed
 */
export const uploadUserAvatar = async (file: File): Promise<string> => {
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

/**
 * Fetches the avatar image of a user by their user ID.
 * Sends a GET request and returns a local object URL of the image blob.
 * @param userId - The ID of the user whose avatar is requested
 * @returns Promise resolving to a local URL string of the avatar image, or empty string if failed
 */
export const getUserAvatarUrl = async (userId: string): Promise<string> => {
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