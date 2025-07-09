'use client';

import PostCard from '@/app/components/post/PostCard';
import { PostsByTagProps } from '@/app/types';
import { Box, Typography, Container, Grid } from '@mui/material';

const PostsByTagClient = ({ posts, tagSlug }: PostsByTagProps) => {

    return (
        <Box
            sx={{
                minHeight: '100vh',
                py: 6,
                background:
                    'radial-gradient(circle at top left, #1e1e2f, #0d0d15)',
                color: '#eee',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        mb: 4,
                        letterSpacing: 1.5,
                        textShadow: '0 0 10px #7f53ac',
                        textAlign: 'center',
                        textTransform: 'capitalize',
                    }}
                >
                    Posts by tag: #{tagSlug}
                </Typography>

                {posts.length === 0 ? (
                    <Typography
                        sx={{
                            color: '#777',
                            textAlign: 'center',
                            mt: 10,
                            fontSize: '1.1rem',
                            fontStyle: 'italic',
                        }}
                    >
                        There are no posts for this tag.
                    </Typography>
                ) : (
                    <Grid container spacing={4}>
                        {posts.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post._id}>
                                <PostCard post={post} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default PostsByTagClient;
