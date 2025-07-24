'use client';

import { Box } from '@mui/material';

const AvatarPreview = ({ url }: { url: string | null }) => {
    if (!url) return null;
    <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img
                src="/path/to/default-avatar.png"
                alt="Avatar"
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                }}
            />
        </Box>

    return (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img
                src={url}
                alt="Avatar"
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                }}
            />
        </Box>
    );
};

export default AvatarPreview;
