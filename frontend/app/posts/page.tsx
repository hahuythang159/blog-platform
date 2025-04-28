'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/app/store/postSlice';
import { RootState } from '@/app/store/store';
import { fetcher } from '@/app/utils/fetcher';
import Link from 'next/link';
import { Container, Typography, Button, Box, Card, CardContent, Avatar, IconButton, Divider } from '@mui/material';
import { MoreHoriz, FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import FloatingSettings from '../components/FloatingSettings';

const PostListPage = () => {
  const dispatch = useDispatch();

  // Access the list of posts from the Redux store
  const posts = useSelector((state: RootState) => state.post.posts);

  useEffect(() => {
    // Fetch posts from the API when the component mounts
    const loadPosts = async () => {
      try {
        const data = await fetcher('posts');

        // Save the fetched posts to the Redux store
        dispatch(setPosts(data));
      } catch (error) {
        console.error(error);
      }
    };
    loadPosts(); // Run the fetch function
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

       {/* Render a list of posts */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts.map((post) => (
          <Card key={post._id} sx={{ borderRadius: '16px', boxShadow: 3 }}>
            {/* Card header: author's avatar and username */}
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href={`/profile/${post.author.username}`} passHref>
                <Avatar alt={post.author.username} src={post.author.avatar} sx={{ width: 40, height: 40, marginRight: 2, cursor: 'pointer' }} />
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

            {/* Post Content */}
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, marginBottom: 1 }}>
                <Link href={`/posts/${post._id}`} passHref>
                  {post.title}
                </Link>
              </Typography>

              {/* Show a shortened version of content if it's too long */}
              <Typography variant="body2" color="text.secondary" noWrap>
                {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
              </Typography>
            </CardContent>

            {/* Card footer: interaction buttons */}
            <Divider />
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 1 }}>

              {/* Like button (not functional yet) */}
              <IconButton>
                <FavoriteBorder />
              </IconButton>
              
              {/* Comment button (not functional yet) */}
              <IconButton>
                <ChatBubbleOutline />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>
      <FloatingSettings/>
    </Container>
  );
};

export default PostListPage;
