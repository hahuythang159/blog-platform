import React from 'react';
import { Card, CardContent, Typography, Divider, IconButton, Box } from '@mui/material';
import Link from 'next/link';
import { FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import { Post, UserPostsProps } from '@/app/types';
import { calculateTimeAgo } from '@/app/utils/timeUtils';

const UserPosts: React.FC<UserPostsProps> = ({ posts, username }) => {
    if (posts.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 5 }}>
                This user has not posted anything yet.
            </Typography>
        );
    }

    return (
        <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" gutterBottom>
                📝 Posts by {username}
            </Typography>
            {posts.map((post) => (
                <Card key={post._id} sx={{ borderRadius: 2, marginBottom: 2 }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left' }}>
                            {calculateTimeAgo(post.createdAt)}
                        </Typography>
                        <Typography
                            variant="h6"
                            component={Link}
                            href={`/posts/${post._id}`}
                            sx={{
                                fontWeight: 600,
                                textDecoration: 'none',
                                color: 'inherit',
                                marginBottom: 1,
                            }}
                        >
                            {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
                        </Typography>
                    </CardContent>
                    <Divider />
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 1 }}>
                        <IconButton>
                            <FavoriteBorder />
                        </IconButton>
                        <IconButton component={Link} href={`/posts/${post._id}`}>
                            <ChatBubbleOutline />
                        </IconButton>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default UserPosts;
