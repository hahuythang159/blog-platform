'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removePost, setPost } from '@/app/store/postSlice';
import { RootState } from '@/app/store/store';
import { useParams, useRouter } from 'next/navigation';
import { usePostStats } from '@/app/hooks/usePostStats';
import { useViewTracker } from '@/app/hooks/useViewTracker';
import LikeButton from '@/app/components/post/LikeButton';
import { Comment } from '@/app/types';
import { deletePostById, getPostById } from '@/app/lib/postService';
import CommentList from '@/app/components/comment/CommentList';
import { getCommentsByPost } from '@/app/lib/commentsService';
import { useRecordInteraction } from '@/app/hooks/useRecordInteraction';
import { getUserAvatarUrl } from '@/app/lib/avatarService';
import { Alert, Avatar, Box, Card, CardContent, Chip, IconButton, Menu, MenuItem, Snackbar, Typography } from '@mui/material';
import { calculateTimeAgo } from '@/app/utils/timeUtils';
import { MoreHoriz } from '@mui/icons-material';
import EditPostPage from '../edit/[id]/page';

const PostDetailPage = () => {
  const { id } = useParams();
  const postId = id as string;
  const dispatch = useDispatch();
  const router = useRouter();

  const post = useSelector((state: RootState) => state.post.post);
  const user = useSelector((state: RootState) => state.user.user);

  const [comments, setComments] = useState<Comment[]>([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { stats, setStats } = usePostStats(postId);
  const { triggerInteraction } = useRecordInteraction();
  useViewTracker(postId);

  const openMenu = Boolean(anchorEl);

  const showError = useCallback((msg: string) => {
    setError(msg);
    setOpenSnackbar(true);
  }, []);

  const fetchPost = async () => {
    try {
      const data = await getPostById(postId);
      dispatch(setPost(data));
      const avatar = await getUserAvatarUrl(data.author._id);
      setAvatarUrl(avatar);
    } catch (err: any) {
      showError(err?.message || 'Failed to load post.');
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByPost(postId);
      setComments(data);
    } catch (err: any) {
      showError(err?.message || 'Failed to load comments.');
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    triggerInteraction(postId, 'view');
  }, [postId]);

  const handleDelete = async () => {
    if (!user?.token) {
      alert('You must log in to continue!');
      return
    }

    try {
      await deletePostById(postId, user.token);
      dispatch(removePost(postId));
      router.push('/posts');
    } catch (err: any) {
      showError(err?.message || 'Failed to delete post.');
    }
  };

  const handleAddComment = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c._id !== commentId));
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!post) return <Typography>Loading...</Typography>;

  return (
    <>
      {isEditing ? (
        <EditPostPage
          postId={postId}
          onCancel={() => setIsEditing(false)}
          onUpdated={() => { setIsEditing(false), fetchPost() }}
        />
      ) : (
        <>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} padding={2} alignItems="flex-start" height="100vh" boxSizing="border-box">
            {/* POST DETAIL */}
            <Box
              sx={{ flex: 15, minWidth: 0, height: 'auto', overflow: 'visible', borderRadius: 3, boxShadow: 3, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}
            >
              <Card sx={{ borderRadius: 3, flex: 'none', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ pb: 0 }}>
                  <Box display="flex" justifyContent="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      👁️ {stats?.views || 0} Views
                    </Typography>
                  </Box>
                </CardContent>
                <CardContent sx={{ flexGrow: 1, overflowY: 'visible' }}>
                  {/* phần tiêu đề và nội dung */}
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Avatar src={avatarUrl} sx={{ width: 48, height: 48, mr: 2 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {post.author.username}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {calculateTimeAgo(post.createdAt)}
                    </Typography>
                  </Box>

                  {user?.username === post.author.username && (
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton onClick={handleMenuClick}>
                        <MoreHoriz />
                      </IconButton>
                      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem
                          onClick={() => {
                            setIsEditing(true);
                            handleMenuClose();
                          }}
                        >
                          Edit
                        </MenuItem>

                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      </Menu>
                    </Box>
                  )}

                  <Typography variant="h5" mt={2} fontWeight={700} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body1" mt={1} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {post.content}
                  </Typography>

                  <Box mt={3} display="flex" alignItems="center" gap={2}>
                    <LikeButton postId={postId} likedBy={stats?.likes || []} setStats={setStats} />
                  </Box>
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
              </Card>
            </Box>

            {/* COMMENTS SECTION */}
            <Box
              sx={{ flex: 5, height: '100%', overflow: 'auto', borderRadius: 3, boxShadow: 1, bgcolor: 'background.paper', padding: 1 }}
            >
              <CommentList comments={comments} postId={postId} onDelete={handleDeleteComment} onAdd={handleAddComment} />
            </Box>

            <Snackbar open={openSnackbar} onClose={() => setOpenSnackbar(false)} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
          </Box>
        </>
      )}</>
  );
}

export default PostDetailPage;
