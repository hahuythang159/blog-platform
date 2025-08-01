'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllPosts, setFollowingPosts } from '@/app/store/postSlice';
import { RootState } from '@/app/store/store';
import { Container, Typography, Button, Box, Alert, Modal, Fade, Backdrop, Snackbar, CircularProgress, } from '@mui/material';
import PostCard from '../components/post/PostCard';
import PostCardSkeleton from '../components/skeletons/PostCardSkeleton';
import CreatePostForm from '../components/post/CreatePostForm';
import { getPosts, getFollowingPosts, searchPosts } from '../lib/postService';
import useLazyLoadPosts from '../hooks/useLazyLoadPosts';
import { getToken } from '../utils/token';
import PostsLayout from '../components/layout/PostsLayout';
import { Post } from '../types';

const PostListPage = () => {
  const dispatch = useDispatch();
  const { allPosts, followingPosts } = useSelector((state: RootState) => state.post);
  const [tab, setTab] = useState<'foryou' | 'following'>('foryou');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const displayedPosts = searchKeyword.trim() ? searchResults : (tab === 'foryou' ? allPosts : followingPosts);
  const { visibleItems, loaderRef, hasMore } = useLazyLoadPosts(displayedPosts, 10, 5);

  const isAuthenticated = Boolean(getToken());

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const [foryou, following] = await Promise.all([
        getPosts(),
        isAuthenticated ? getFollowingPosts() : Promise.resolve([]),
      ]);
      dispatch(setAllPosts(foryou))
      dispatch(setFollowingPosts(following))
      setError(null)
    } catch (err: any) {
      setError(err?.message || 'Could not load posts. Please try again later.');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchPosts({ keyword });
      setSearchResults(results);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [dispatch]);

  return (
    <PostsLayout
      tab={tab}
      onTabChange={(value) => setTab(value)}
      showTabs={isAuthenticated}
      onSearch={handleSearch}
    >
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

      <Container maxWidth="sm" sx={{ paddingY: 4 }}>
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

        <Snackbar open={openSnackbar} onClose={() => setOpenSnackbar(false)} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Post list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {isLoading || isSearching
            ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
            : visibleItems.map((post) => <PostCard key={post._id} post={post} />)}

          {hasMore && !isSearching && (
            <Box ref={loaderRef} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>

      </Container>
    </PostsLayout>
  );
};

export default PostListPage;
