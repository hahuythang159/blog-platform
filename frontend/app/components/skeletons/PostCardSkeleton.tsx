import { Card, CardContent, Skeleton, Divider, IconButton, Box } from '@mui/material';
import { MoreHoriz, ChatBubbleOutline } from '@mui/icons-material';

const PostCardSkeleton = () => {
    return (
        <Card sx={{ borderRadius: '16px', boxShadow: 3, marginBottom: 2, overflow: 'hidden' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flexGrow: 1, ml: 2 }}>
                    <Skeleton variant="text" width="30%" height={24} />
                </Box>
                <Skeleton variant="text" width={40} height={16} />
                <IconButton disabled>
                    <MoreHoriz />
                </IconButton>
            </CardContent>

            <CardContent>
                <Skeleton variant="text" width="70%" height={30} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
            </CardContent>

            <Divider />
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 1 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <IconButton disabled>
                    <ChatBubbleOutline />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default PostCardSkeleton;
