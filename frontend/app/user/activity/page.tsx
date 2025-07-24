'use client';

import UserActivityHistory from '@/app/components/user/History';
import { Box, Typography } from '@mui/material';

export default function UserActivityPage() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Recent activity
      </Typography>
      <UserActivityHistory />
    </Box>
  );
}
