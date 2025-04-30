'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/app/store/postSlice';
import { RootState } from '@/app/store/store';
import { fetcher } from '@/app/utils/fetcher';
import Link from 'next/link';
import { Container, Typography, Button, Box } from '@mui/material';
import FloatingSettings from '../components/FloatingSettings';
import PostCard from '../components/PostCard';

const PostListPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.post.posts);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetcher('posts');
        dispatch(setPosts(data));
      } catch (error) {
        console.error(error);
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

      {/* Post list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </Box>

      <FloatingSettings />
    </Container>
  );
};

export default PostListPage;
