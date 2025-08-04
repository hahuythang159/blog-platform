import React, { useState } from 'react';
import { Box, Typography, Divider, Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { deleteComment, createComment } from '@/app/lib/commentsService';
import { CommentListProps } from '@/app/interfaces/commentListProps';
import { Comment } from '@/app/types';
import { useAvatarUrls } from '@/app/hooks/useAvatarUrls';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Slide from '@mui/material/Slide';
import useLazyLoadPosts from '@/app/hooks/useLazyLoadPosts';

const CommentList: React.FC<CommentListProps> = ({ comments, postId, onAdd, onDelete }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const currentUserId = user?._id;
  const [loading, setLoading] = useState(false);
  const avatarUrls = useAvatarUrls(comments);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { visibleItems, loaderRef, hasMore } = useLazyLoadPosts(comments);

  const handleDelete = async (commentId: string) => {
    if (!user?.token) {
      alert('Please log in to delete comments');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    try {
      await deleteComment(commentId, user.token);
      onDelete(commentId);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete comment.');
      setOpenSnackbar(true);
    }
  };

  const handleAdd = async (content: string) => {
    if (!user?.token) {
      alert('Please log in to post comments');
      return;
    }

    setLoading(true);
    try {
      const newComment: Comment = await createComment({ postId, content });
      setNewlyAddedId(newComment._id);
      onAdd(newComment);
      setTimeout(() => setNewlyAddedId(null), 300);
    } catch (err: any) {
      setError(err?.message || 'Failed to post comment');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={2}>
      {/* Comment Input */}
      <CommentForm onSubmit={handleAdd} isLoading={loading} postId={postId} />

      <Divider sx={{ my: 3 }} />

      {/* Comment List */}
      {visibleItems.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No comments yet. Be the first to reply!
        </Typography>
      ) : (
        visibleItems.map((comment) => (
          <Slide
            key={comment._id}
            direction="up"
            in={true}
            timeout={comment._id === newlyAddedId ? 300 : 0}
          >
            <div>
              <CommentItem
                comment={comment}
                avatarUrl={avatarUrls[comment.author._id] || ''}
                isLoading={false}
                onDelete={handleDelete}
                currentUserId={currentUserId}
              />
            </div>
          </Slide>
        ))
      )}

      {/* Lazy loader trigger */}
      {hasMore && (
        <Box ref={loaderRef} sx={{ height: 1 }} />
      )}

      <Snackbar open={openSnackbar} onClose={() => setOpenSnackbar(false)} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
    </Box>
  );
};

export default CommentList;
