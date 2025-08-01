import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { AuthLayoutProps } from '@/app/types';

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('/images/background_authLayout.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ backdropFilter: 'blur(10px)', backgroundColor: '#000000', padding: 4, borderRadius: 6, appearance: 'none' }} >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Inknut Antiqua", serif', fontWeight: 'bold', color: '#ffffff' }}>
              {title}
            </Typography>
            <Box sx={{ height: '3px', width: '40%', backgroundColor: '#ffffff', margin: '10px auto 20px auto', borderRadius: 1 }} />
          </Box>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
