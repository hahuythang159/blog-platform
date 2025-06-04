import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

type AuthLayoutProps = {
    title: string;
    children: React.ReactNode;
};

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url('/images/bg-login.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                px: 10,
            }}
        >
            <Container maxWidth="sm" >
                <Paper
                    elevation={6}
                    sx={{
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        padding: 4,
                        borderRadius: 10,
                    }}
                >

                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#ffffff', display: 'flex', justifyContent: 'center' }}>
                        {title}
                    </Typography>
                    {children}
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthLayout;
