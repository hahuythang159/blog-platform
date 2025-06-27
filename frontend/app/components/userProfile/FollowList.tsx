import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import Link from 'next/link';
import { FollowListProps } from '@/app/types';

const FollowList: React.FC<FollowListProps> = ({ tab, followers, following, loadingList }) => {
    const data = tab === 'followers' ? followers : following;

    if (loadingList) return <Typography>Loading...</Typography>;
    if (data.length === 0) return <Typography>No data available</Typography>;

    return (
        <List>
            {data.map((user) => (
                <Link key={user.userId} href={`/profile/${user.username}`} passHref legacyBehavior>
                    <ListItem sx={{ cursor: 'pointer' }}>
                        <ListItemAvatar>
                            <Avatar src={user.avatar} />
                        </ListItemAvatar>
                        <ListItemText primary={user.username} />
                    </ListItem>
                </Link>
            ))}
        </List>
    );
};

export default FollowList;
