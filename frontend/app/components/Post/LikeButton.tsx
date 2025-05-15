'use client';

import { useState } from 'react';
import {
    IconButton,
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useToggleLike } from '@/app/hooks/useToggleLike';
import { RootState } from '@/app/store/store';
import { useRouter } from 'next/navigation';
import { LikeButtonProps } from '@/app/types/LikeButtonProps';

const LikeButton = ({ postId, likedBy, setStats }: LikeButtonProps) => {
    const user = useSelector((state: RootState) => state.user.user);
    const router = useRouter();
    const { toggleLike, isLiking } = useToggleLike(postId, user?.token || '');
    const [showPrompt, setShowPrompt] = useState(false);

    const isLiked = likedBy?.some(u => u._id === user?.id);

    const handleClick = async () => {
        if (!user) {
            setShowPrompt(true);
            return;
        }
        const updated = await toggleLike();
        if (updated) setStats(updated);
    };

    const handleLoginRedirect = () => {
        setShowPrompt(false);
        router.push('/login');
    };

    const handleClose = () => setShowPrompt(false);

    return (
        <>
            <IconButton onClick={handleClick} disabled={isLiking}>
                {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                <Typography variant="body2" sx={{ ml: 1 }}>
                    {likedBy?.length || 0}
                </Typography>
            </IconButton>

            <Dialog open={showPrompt} onClose={handleClose}>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Like this content? You’ll love Soulink.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Log in to like, reply, and more.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLoginRedirect} variant="contained" color="primary">
                        Log in
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LikeButton;
