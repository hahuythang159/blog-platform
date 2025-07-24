'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/app/store/postSlice';
import { RootState } from '@/app/store/store';
import { Container, Typography, Button, Box, Alert, Modal, Fade, Backdrop, Snackbar } from '@mui/material';
import PostCard from '../components/post/PostCard';
import { getPosts } from '../lib/postService';
import PostCardSkeleton from '../components/skeletons/PostCardSkeleton';
import CreatePostForm from '../components/post/CreatePostForm';

const PostListPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.post.posts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      dispatch(setPosts(data));
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Could not load posts. Please try again later.');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [dispatch]);

  return (
    <Container maxWidth="sm" sx={{ paddingY: 4 }}>
      {/* Page title */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Community Posts
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenForm(true)}
        sx={{ marginBottom: 3, borderRadius: '20px' }}
      >
        Create Your Post
      </Button>

      <Modal open={openForm} onClose={() => setOpenForm(false)} closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={openForm}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: 600,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              outline: 'none',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <CreatePostForm onPostCreated={() => {
              loadPosts(), setOpenForm(false);
            }}
            />
          </Box>
        </Fade>
      </Modal>

      <Snackbar open={openSnackbar} onClose={() => setOpenSnackbar(false)} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Post list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
          : posts.map((post) => <PostCard key={post._id} post={post} />)}
      </Box>

    </Container>
  );
};

export default PostListPage;
