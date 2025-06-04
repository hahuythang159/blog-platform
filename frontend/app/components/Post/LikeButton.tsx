'use client';

import { useState } from 'react';
import {
    IconButton,
    Typography,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useToggleLike } from '@/app/hooks/useToggleLike';
import { RootState } from '@/app/store/store';
import { LikeButtonProps } from '@/app/interfaces/likeButtonProps';
import RequireLoginDialog from '@/app/components/auth/RequireLoginDialog';

const LikeButton = ({ postId, likedBy, setStats }: LikeButtonProps) => {
    const user = useSelector((state: RootState) => state.user.user);
    const { toggleLike, isLiking } = useToggleLike(postId, user?.token || '');
    const [showPrompt, setShowPrompt] = useState(false);

    const isLiked = likedBy?.some(u => u._id === user?._id);

    const handleClick = async () => {
        if (!user) {
            setShowPrompt(true);
            return;
        }
        const updated = await toggleLike();
        if (updated) setStats(updated);
    };

    return (
        <>
            <IconButton onClick={handleClick} disabled={isLiking}>
                {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                <Typography variant="body2" sx={{ ml: 1 }}>
                    {likedBy?.length || 0}
                </Typography>
            </IconButton>

            <RequireLoginDialog
                open={showPrompt}
                onClose={() => setShowPrompt(false)}
                title='Please log in'
                message='Log in to like and interact with posts.'
            />
        </>
    );
};

export default LikeButton;
