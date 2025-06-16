import React from 'react';
import { Box, Typography, Skeleton, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CommentItemProps } from '../../interfaces/commentItemProps';

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    avatarUrl,
    onDelete,
    currentUserId,
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
                />
            ) : (
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            )}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">{comment.author.username}</Typography>
                <Typography variant="body2">{comment.content}</Typography>
            </Box>
            {comment.author._id === currentUserId && (
                <IconButton onClick={() => onDelete(comment._id)} sx={{ color: 'red', ml: 1 }}>
                    <DeleteIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default CommentItem;
