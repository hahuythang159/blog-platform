import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { deleteComment, createComment } from '../../lib/commentsService';
import { CommentListProps } from '../../interfaces/commentListProps';
import { Comment } from '@/app/types';
import { useAvatarUrls } from '@/app/hooks/useAvatarUrls';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentList: React.FC<CommentListProps> = ({ comments, postId, onAdd, onDelete }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const currentUserId = user?._id;
  const [loading, setLoading] = useState(false);
  const avatarUrls = useAvatarUrls(comments);

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
    } catch (error: any) {
      alert(error.message || 'Failed to delete comment');
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
      onAdd(newComment);
    } catch (error: any) {
      alert(error.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Comments</Typography>

      {comments.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No comments yet.
        </Typography>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            avatarUrl={avatarUrls[comment.author._id] || ''}
            onDelete={handleDelete}
            currentUserId={currentUserId}
          />
        ))
      )}

      <CommentForm onSubmit={handleAdd} isLoading={loading} />
    </Box>
  );
};

export default CommentList;
