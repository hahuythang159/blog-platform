'use client';

import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';
import { PostsLayoutProps } from '../../interfaces/postsLayoutProps';
import SearchBar from '../post/SearchBar';

export default function PostsLayout({ children, tab, onTabChange, showTabs = false, onSearch }: PostsLayoutProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <AppBar position="static" elevation={1} sx={{ backgroundColor: '#fff', color: '#000' }}>
                <Toolbar sx={{ position: 'relative', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="h6" sx={{ zIndex: 1 }}>
                        LinkSoul
                    </Typography>

                    {showTabs && tab && onTabChange && (
                        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 0 }} >
                            <Button
                                disableRipple
                                onClick={() => onTabChange('foryou')}
                                sx={{
                                    fontSize: '1rem',
                                    color: tab === 'foryou' ? '#000' : '#888',
                                    fontWeight: tab === 'foryou' ? 600 : 400,
                                    backgroundColor: 'transparent',
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&:active': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                For you
                            </Button>

                            <Button
                                disableRipple
                                onClick={() => onTabChange('following')}
                                sx={{
                                    fontSize: '1rem',
                                    color: tab === 'following' ? '#000' : '#888',
                                    fontWeight: tab === 'following' ? 600 : 400,
                                    backgroundColor: 'transparent',
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&:active': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                Following
                            </Button>
                        </Box>
                    )}

                    <SearchBar onSearch={onSearch} />
                </Toolbar>
            </AppBar>

            <Box sx={{ flex: 1, overflowY: 'auto', backgroundColor: '#fafafa' }}>
                <Container maxWidth="sm" sx={{ py: 4 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
