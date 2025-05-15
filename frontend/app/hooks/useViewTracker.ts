import { useEffect } from 'react';
import { incrementPostView } from '../lib/postService';

export const useViewTracker = (postId: string) => {
    useEffect(() => {
        if (!postId) return;
        incrementPostView(postId);
    }, [postId]);
};
