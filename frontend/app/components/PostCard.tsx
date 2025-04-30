import { useEffect, useState } from 'react';
import { Avatar, Card, CardContent, Divider, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import { ChatBubbleOutline, FavoriteBorder, MoreHoriz } from '@mui/icons-material';
import { getAvatarUrl } from '../lib/avatarService';

const PostCard = ({ post }: { post: any }) => {
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        const loadAvatar = async () => {
            const url = await getAvatarUrl(post.author._id);
            setAvatarUrl(url);
        };
        loadAvatar();
    }, [post.author._id]);

    return (
        <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Link href={`/profile/${post.author.username}`} passHref>
                    <Avatar
                        alt={post.author.username}
                        src={avatarUrl}
                        sx={{ width: 40, height: 40, marginRight: 2, cursor: 'pointer' }}
                    />
                </Link>
                <Link href={`/profile/${post.author.username}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 500 }}>
                        {post.author.username}
                    </Typography>
                </Link>
                <IconButton>
                    <MoreHoriz />
                </IconButton>
            </CardContent>

            <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600, marginBottom: 1 }}>
                    <Link href={`/posts/${post._id}`} passHref>
                        {post.title}
                    </Link>
                </Typography>

                <Typography variant="body2" color="text.secondary" noWrap>
                    {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                </Typography>
            </CardContent>

            <Divider />
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 1 }}>
                <IconButton>
                    <FavoriteBorder />
                </IconButton>
                <IconButton>
                    <ChatBubbleOutline />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default PostCard;
