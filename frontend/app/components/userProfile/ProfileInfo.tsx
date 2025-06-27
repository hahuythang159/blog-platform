import React, { useMemo } from 'react';
import { Avatar, Box, Typography, Button } from '@mui/material';
import { ProfileInfoProps } from '@/app/interfaces/ProfileInfo';

const ProfileInfo: React.FC<ProfileInfoProps> = ({
    profile,
    isFollowing,
    isProcessing,
    onToggleFollow,
    loggedInUser,
}) => {
    const avatarUrl = useMemo(() => profile ? `${process.env.NEXT_PUBLIC_API_URL}${profile.avatar}` : '', [profile]);

    const isOwnProfile = loggedInUser?.username === profile.username;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={avatarUrl} sx={{ width: 80, height: 80 }} />
            <Box>
                <Typography variant="h5">{profile.username}</Typography>
                <Typography variant="body2" color="text.secondary">{profile.bio || 'No bio yet'}</Typography>
                {!isOwnProfile && loggedInUser && (
                    <Box sx={{ marginTop: 2 }}>
                        <Button
                            variant={isFollowing ? 'outlined' : 'contained'}
                            color="primary"
                            onClick={onToggleFollow}
                            disabled={isProcessing}
                        >
                            {isProcessing
                                ? 'Processing...'
                                : isFollowing
                                    ? 'Unfollow'
                                    : 'Follow'}
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ProfileInfo;
