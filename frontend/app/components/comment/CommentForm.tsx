import React, { useState } from 'react';
import { CommentFormProps } from '../../interfaces/commentFormProps';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useRecordInteraction } from '@/app/hooks/useRecordInteraction';
import { getUserAvatarUrl } from '@/app/lib/avatarService';
import { useEffect } from 'react';
import { Avatar, Box, Button, CircularProgress, InputAdornment, TextField } from '@mui/material';

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isLoading, postId }) => {
  const [content, setContent] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const { triggerInteraction } = useRecordInteraction();

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user?._id) {
        const url = await getUserAvatarUrl(user._id);
        setAvatarUrl(url);
      }
    };
    fetchAvatar();
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    onSubmit(content);
    setContent('');
    if (postId) triggerInteraction(postId, 'comment');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 3, gap: 2 }}
    >
      <Avatar src={avatarUrl} sx={{ width: 36, height: 36, mt: '4px' }} />

      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={6}
        placeholder="Write your reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={isLoading || !content.trim()}
              >
                {isLoading ? <CircularProgress size={16} /> : 'Reply'}
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default CommentForm;
