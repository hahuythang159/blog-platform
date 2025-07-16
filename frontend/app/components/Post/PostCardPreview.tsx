'use client';

import { Avatar, Box, Card, CardContent, Chip, Divider, IconButton, Typography } from '@mui/material';
import { ChatBubbleOutline, FavoriteBorder, MoreHoriz } from '@mui/icons-material';

const PostCardPreview = ({ post }: { post: any }) => {
    return (
        <Card sx={{ borderRadius: '16px', boxShadow: 3, marginBottom: 2, overflow: 'hidden', opacity: 0.85 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    alt={post.author.username}
                    src={post.author.avatar}
                    sx={{ width: 40, height: 40, marginRight: 2 }}
                />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {post.author.username}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="caption" color="text.secondary">
                    just now
                </Typography>
                <IconButton disabled>
                    <MoreHoriz />
                </IconButton>
            </CardContent>

            <CardContent>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, marginBottom: 1, fontSize: '1.2rem', lineHeight: 1.4 }}
                >
                    {post.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
                </Typography>

                {post.tags?.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {post.tags.map((tag: any) => (
                            <Chip
                                key={tag._id}
                                label={`#${tag.name}`}
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontSize: '0.75rem',
                                    color: 'primary.main',
                                    borderColor: 'primary.light',
                                }}
                            />
                        ))}
                    </Box>
                )}

            </CardContent>

            <Divider />

            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 1 }}>
                <IconButton disabled>
                    <FavoriteBorder />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        0
                    </Typography>
                </IconButton>

                <IconButton disabled>
                    <ChatBubbleOutline />
                </IconButton>

            </CardContent>
        </Card>
    );
};

export default PostCardPreview;
