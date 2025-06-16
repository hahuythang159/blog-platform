import React from 'react';
import { Box, Skeleton } from '@mui/material';

const CommentItemSkeleton: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
                <Skeleton width="60%" />
                <Skeleton width="80%" />
            </Box>
        </Box>
    );
};

export default CommentItemSkeleton;
