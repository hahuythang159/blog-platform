import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { CommentFormProps } from '../../interfaces/commentFormProps';
import { useRecordInteraction } from '@/app/hooks/useRecordInteraction';

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isLoading, postId }) => {
    const [content, setContent] = useState('');
    const { triggerInteraction } = useRecordInteraction()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('Comment cannot be empty');
            return;
        }
        onSubmit(content);
        setContent('');
        if (postId) {
            triggerInteraction(postId, 'comment')
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                fullWidth
                multiline
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                variant="outlined"
                sx={{ mb: 1 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                {isLoading ? 'Posting...' : 'Post Comment'}
            </Button>
        </Box>
    );
};

export default CommentForm;
