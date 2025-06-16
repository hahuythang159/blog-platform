'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/app/store/postSlice';
import { RootState } from '@/app/store/store';
import Link from 'next/link';
import { Container, Typography, Button, Box, Alert } from '@mui/material';
import FloatingSettings from '../components/user/FloatingSettings';
import PostCard from '../components/post/PostCard';
import { getPosts } from '../lib/postService';
import PostCardSkeleton from '../components/skeletons/PostCardSkeleton';

const PostListPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.post.posts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getPosts()
        dispatch(setPosts(data));
        setError(null); // Clear error if refetch is successful
      } catch (err: any) {
        console.error('Failed to fetch posts:', err);
        setError('Could not load posts. Please try again later.');
      } finally {
        setIsLoading(false)
      }
    };
    loadPosts();
  }, [dispatch]);

  return (
    <Container maxWidth="sm" sx={{ paddingY: 4 }}>
      {/* Page title */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Community Posts
      </Typography>

      {/* Button to navigate to the post creation page */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        href="/posts/new"
        sx={{ marginBottom: 3, borderRadius: '20px' }}
      >
        Create Your Post
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Post list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
          : posts.map((post) => <PostCard key={post._id} post={post} />)}
      </Box>

      <FloatingSettings />
    </Container>
  );
};

export default PostListPage;
