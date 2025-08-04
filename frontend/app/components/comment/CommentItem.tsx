import React from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CommentItemProps } from '@/app/interfaces/commentItemProps';

const CommentItem: React.FC<CommentItemProps> = ({ comment, avatarUrl, currentUserId, isLoading, onDelete }) => {
    const isAuthor = currentUserId === comment.author._id;

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3, maxWidth: '100%' }} >
            <Avatar src={avatarUrl} alt={comment.author.username}
                sx={{ width: 36, height: 36, mt: '4px' }} />

            {/* Comment Content */}
            <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, px: 2, py: 1.5, maxWidth: '600px', width: '100%', wordBreak: 'break-word', }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        {comment.author.username}
                    </Typography>

                    {isAuthor && (
                        <IconButton size="small" onClick={() => onDelete(comment._id)} disabled={isLoading}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>

                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {comment.content}
                </Typography>
            </Box>
            
        </Box>
    );
};

export default CommentItem;
