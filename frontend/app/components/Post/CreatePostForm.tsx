'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { createPost } from '@/app/lib/postService';
import suggestedTags from '@/app/data/suggestedTags';
import RequireLoginDialog from '../auth/RequireLoginDialog';
import PreviewIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import { Alert, Autocomplete, Avatar, Box, Button, Chip, Divider, IconButton, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import PostCardPreview from './PostCardPreview';
import { getUserAvatarUrl } from '@/app/lib/avatarService';

const CreatePostForm = ({ onPostCreated }: { onPostCreated: () => void }) => {
    const user = useSelector((state: RootState) => state.user.user);
    const [form, setForm] = useState({ title: '', content: '', tags: [] as string[] });
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [error, setError] = useState<string | null>('')
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [userAvatarUrl, setUserAvatarUrl] = useState<string>('')

    useEffect(() => {
        if (user?._id) fetchAvatar(user._id);
    }, [user?._id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.token) {
            setShowLoginModal(true);
            return;
        }

        try {
            await createPost(user.token, {
                title: form.title,
                content: form.content,
                tags: form.tags
            });
            setForm({ title: '', content: '', tags: [] });
            setShowPreview(false);
            setError(null);
            onPostCreated();
        } catch (err: any) {
            setError(err?.message || 'An unexpected error occurred.')
            setOpenSnackbar(true)
        }
    };

    const fetchAvatar = async (userId: string) => {
        const avatarUrl = await getUserAvatarUrl(userId);
        setUserAvatarUrl(avatarUrl);
    };

    const previewPost = {
        _id: 'preview-id',
        title: form.title,
        content: form.content,
        tags: form.tags.map(tag => ({ _id: tag, name: tag.trim(), slug: tag.trim().toLowerCase() })),
        createdAt: new Date().toISOString(),
        author: {
            _id: user?._id || 'preview-user-id',
            username: user?.username || 'Username'
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}
            sx={{ p: 3, borderRadius: 3, backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={userAvatarUrl}>
                    {user?.username?.[0] || '?'}
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {user?.username || 'Guest'} — What’s on your mind?
                </Typography>
            </Box>

            {/* Content */}
            <TextField name="content" placeholder="Share something inspiring, thoughtful or just say hi..." multiline minRows={4} value={form.content} onChange={handleChange} fullWidth variant="outlined" />

            {/* Optional: Title (optional or bold headline) */}
            <TextField label="Optional Title" name="title" value={form.title} onChange={handleChange} fullWidth />

            {/* Tags */}
            <Autocomplete multiple freeSolo options={suggestedTags} value={form.tags}
                onChange={(event, newValue) => {
                    setForm({ ...form, tags: newValue });
                }}
                renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Tags"
                        placeholder="Add or type a tag"
                    />
                )}
                filterSelectedOptions
            />


            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tooltip title={showPreview ? "Hide preview" : "Preview post"}>
                    <IconButton onClick={() => setShowPreview(!showPreview)} color="primary">
                        <PreviewIcon />
                    </IconButton>
                </Tooltip>

                <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                    Share
                </Button>
            </Box>

            {/* Preview section */}
            {showPreview && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">Live Preview</Typography>
                    <div style={{ pointerEvents: 'none', userSelect: 'none', opacity: 0.9 }}>
                        <PostCardPreview post={previewPost} />
                    </div>
                </>
            )}

            <Snackbar open={openSnackbar} onClose={() => setOpenSnackbar(false)} autoHideDuration={6000} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>


            {/* Login Prompt */}
            <RequireLoginDialog
                open={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                title="Please log in"
                message="Please log in to share your thoughts"
            />
        </Box>
    );
};

export default CreatePostForm;
