import React from 'react';
import { Box, Typography } from '@mui/material';
import { FollowStatsProps } from '@/app/types';

const FollowStats: React.FC<FollowStatsProps> = ({ profile }) => (
    <Box sx={{ marginTop: 3 }}>
        <Typography>👥 Followers: {profile.followersCount}</Typography>
        <Typography>➡️ Following: {profile.followingCount}</Typography>
        <Typography>📝 Posts: {profile.postCount}</Typography>
        {profile.gender && <Typography>🚻 Gender: {profile.gender}</Typography>}
    </Box>
);

export default FollowStats;
