'use client';

import { useUserInteractions } from '@/app/hooks/useUserInteractions';
import { RootState } from '@/app/store/store';
import { Tabs, Tab, Box, Typography, CircularProgress, Link as MuiLink, } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const typeLabels: Record<string, string> = {
    all: 'All',
    view: 'Viewed',
    like: 'Liked',
    comment: 'Commented',
};

const UserActivityHistory = () => {
    const { interactions, loading, error } = useUserInteractions();
    const [filter, setFilter] = useState<'all' | 'view' | 'like' | 'comment'>('all');
    const user = useSelector((state: RootState) => state.user.user)

    if (!user?.token) {
        return <Typography>No activity.</Typography>;
    }

    const filtered = filter === 'all'
        ? interactions
        : interactions.filter(i => i.type === filter);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (filtered.length === 0) return <Typography>No activity.</Typography>;

    return (
        <Box>
            <Tabs
                value={filter}
                onChange={(_, value) => setFilter(value)}
                sx={{ mb: 2 }}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                {Object.entries(typeLabels).map(([key, label]) => (
                    <Tab key={key} value={key} label={label} />
                ))}
            </Tabs>

            {filtered.map((interaction) => (
                <Box
                    key={interaction._id}
                    mb={2}
                    p={2}
                    borderRadius={2}
                    sx={{
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        backgroundColor: (theme) => theme.palette.background.paper,
                    }}
                >

                    <Typography variant="body1">
                        <strong>{typeLabels[interaction.type]}</strong> -{' '}
                        <MuiLink component={Link} href={`/posts/${interaction.post._id}`}>
                            {interaction.post.title}
                        </MuiLink>
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {new Date(interaction.createdAt).toLocaleString()}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default UserActivityHistory;
