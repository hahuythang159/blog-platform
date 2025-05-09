import { fetcher } from "../utils/fetcher";

export const deleteUserAccount = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
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
