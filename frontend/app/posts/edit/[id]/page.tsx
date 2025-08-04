'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { getPostById, updatePostById } from '@/app/lib/postService';
import suggestedTags from '@/app/data/suggestedTags';
import PreviewIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import { getUserAvatarUrl } from '@/app/lib/avatarService';
import PostCardPreview from '@/app/components/post/PostCardPreview';
import { Tag } from '@/app/types';
import RequireLoginDialog from '@/app/components/auth/RequireLoginDialog';
import { Alert, Autocomplete, Avatar, Box, Button, Chip, Divider, IconButton, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import { EditPostPageProps } from '@/app/interfaces/editPostPageProps';

const EditPostPage = ({ postId, onCancel, onUpdated }: EditPostPageProps) => {
  const user = useSelector((state: RootState) => state.user.user);

  const [form, setForm] = useState({ title: '', content: '', tags: [] as string[] });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState('');

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        setForm({
          title: data.title,
          content: data.content,
          tags: (data.tags || []).map((tag: Tag) => tag.name),
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to load post data.');
        setOpenSnackbar(true);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (user?._id) {
      getUserAvatarUrl(user._id).then(setUserAvatarUrl);
    }
  }, [user?._id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagsChange = (_event: any, newValue: string[]) => {
    setForm({ ...form, tags: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) {
      setShowLoginModal(true);
      return;
    }

    try {
      await updatePostById(postId, user.token, form);
      onUpdated?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to update post.');
      setOpenSnackbar(true);
    }
  };

  const previewPost = {
    _id: postId,
    title: form.title,
    content: form.content,
    tags: form.tags.map(tag => ({
      _id: tag,
      name: tag.trim(),
      slug: tag.trim().toLowerCase(),
    })),
    createdAt: new Date().toISOString(),
    author: {
      _id: user?._id || 'unknown',
      username: user?.username || 'Unknown User',
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={userAvatarUrl}>{user?.username?.[0] || '?'}</Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Edit your post
        </Typography>
      </Box>

      <TextField label="Title" name="title" value={form.title} onChange={handleChange} required fullWidth />

      <TextField label="Content" name="content" value={form.content} onChange={handleChange} multiline minRows={4} required fullWidth />

      <Autocomplete multiple freeSolo options={suggestedTags} value={form.tags} onChange={handleTagsChange}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            placeholder="Add or type a tag"
            fullWidth
          />
        )}
        filterSelectedOptions
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={showPreview ? 'Hide preview' : 'Preview post'}>
            <IconButton onClick={() => setShowPreview(!showPreview)} color="primary">
              <PreviewIcon />
            </IconButton>
          </Tooltip>

          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{
                borderColor: 'error.main',
                color: 'error.main',
                minWidth: 120,
                height: 35,
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          sx={{
            backgroundColor: 'primary.main',
            color: '#fff',
            minWidth: 120,
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
            '&:hover': {
              backgroundColor: 'primary.dark',
              boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
            },
          }}
        >
          Update
        </Button>
      </Box>

      {showPreview && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Live Preview
          </Typography>
          <Box sx={{ pointerEvents: 'none', userSelect: 'none', opacity: 0.9 }}>
            <PostCardPreview post={previewPost} />
          </Box>
        </>
      )}

      <Snackbar open={openSnackbar} onClose={() => setOpenSnackbar(false)} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <RequireLoginDialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Please log in"
        message="You must log in to update your post."
      />
    </Box>
  );
};

export default EditPostPage;
