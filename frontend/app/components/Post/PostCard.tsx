import { useEffect, useState } from 'react';
import { Avatar, Card, CardContent, Divider, IconButton, Typography, Box } from '@mui/material';
import { ChatBubbleOutline, MoreHoriz } from '@mui/icons-material';
import { getUserAvatarUrl } from '../../lib/avatarService';
import { calculateTimeAgo } from '../../utils/timeUtils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostStats } from '../../hooks/usePostStats';
import LikeButton from './LikeButton';
import Chip from '@mui/material/Chip'

const PostCard = ({ post }: { post: any }) => {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [timeAgo, setTimeAgo] = useState('');
    const router = useRouter();
    const { stats, setStats } = usePostStats(post._id);

    useEffect(() => {
        const loadAvatar = async () => {
            const url = await getUserAvatarUrl(post.author._id);
            setAvatarUrl(url);
        };
        loadAvatar();

        // Use the calculate Time Ago function from the utils file
        setTimeAgo(calculateTimeAgo(post.createdAt));
    }, [post.createdAt]);

    // Navigate to post details
    const handleNavigateToPost = () => {
        router.push(`/posts/${post._id}`);
    };

    return (
        <Card sx={{ borderRadius: '16px', boxShadow: 3, marginBottom: 2, overflow: 'hidden' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Link href={`/profile/${post.author.username}`} passHref>
                    <Avatar
                        alt={post.author.username}
                        src={avatarUrl}
                        sx={{ width: 40, height: 40, marginRight: 2 }}
                    />
                </Link>
                <Link href={`/profile/${post.author.username}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 500 }}>
                        {post.author.username}
                    </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    {timeAgo}
                </Typography>
                <IconButton>
                    <MoreHoriz />
                </IconButton>
            </CardContent>

            <CardContent sx={{ cursor: 'pointer' }} onClick={handleNavigateToPost}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, marginBottom: 1, fontSize: '1.2rem', lineHeight: 1.4, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} >
                    {post.title}
                </Typography>

                <Typography variant="body2" color="text.secondary"
                    sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', }}
                >
                    {post.content}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, maxWidth: '100%' }}>
                    {post.tags?.map((tag: any) => (
                        <Chip
                            key={tag._id}
                            label={`#${tag.name}`}
                            variant="outlined"
                            size="small"
                            sx={{
                                fontSize: '0.75rem',
                                color: 'primary.main',
                                borderColor: 'primary.light',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white',
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/posts/tags/${tag.slug}`)
                            }}
                        />
                    ))}
                </Box>
            </CardContent>

            <Divider />
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 1 }}>
                <LikeButton postId={post._id} likedBy={stats?.likes || []} setStats={setStats} />
                <IconButton component="button" onClick={() => router.push(`/posts/${post._id}`)}>
                    <ChatBubbleOutline />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default PostCard;
