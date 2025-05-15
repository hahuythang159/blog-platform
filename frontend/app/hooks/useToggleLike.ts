import { useState } from 'react';
import { togglePostLike } from '../lib/postService';

export const useToggleLike = (postId: string, token: string) => {
    const [isLiking, setIsLiking] = useState(false);

    const toggleLike = async () => {
        try {
            setIsLiking(true);
            const updatedStats = await togglePostLike(postId, token);
            return updatedStats;
        } catch (err) {
            alert('Like toggle failed!');
        } finally {
            setIsLiking(false);
        }
    };

    return { toggleLike, isLiking };
};
