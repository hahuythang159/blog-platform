import { useEffect, useState } from 'react';
import { getUserAvatarUrl } from '../lib/avatarService';
import { Comment } from '../types';

// This custom hook fetches and stores avatar URLs for users mentioned in the given comments.
export const useAvatarUrls = (comments: Comment[]) => {
    // State to store a mapping of userId to avatar URL
    const [avatarUrls, setAvatarUrls] = useState<{ [userId: string]: string }>({});

    useEffect(() => {
        // Async function to fetch avatars for users in the comments
        const fetchAvatars = async () => {
            const newAvatars: { [userId: string]: string } = {};

            for (const comment of comments) {
                const userId = comment.author._id;

                // Only fetch the avatar if we don't already have it in state
                // This avoids unnecessary API calls for users we've already fetched
                if (!avatarUrls[userId]) {
                    const url = await getUserAvatarUrl(userId);
                    if (url) {
                        newAvatars[userId] = url;
                    }
                }
            }

            // If any new avatars were fetched, merge them into the existing state
            // Using a functional update to safely combine old and new avatar URLs
            if (Object.keys(newAvatars).length > 0) {
                setAvatarUrls((prev) => ({ ...prev, ...newAvatars }));
            }
        };

        // Only run the fetch if there are comments
        if (comments.length) {
            fetchAvatars();
        }
    }, [comments]);

    return avatarUrls;
};
