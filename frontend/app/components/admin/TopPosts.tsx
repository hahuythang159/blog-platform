import { TopPostsProps } from "@/app/types";
import { Box, Paper, Stack, Typography } from "@mui/material";

const TopPosts = ({ posts }: TopPostsProps) => {
    return (
        <Box mt={6}>
            <Typography variant="h6" gutterBottom>
                📈 Top 5 Posts
            </Typography>
            <Stack spacing={2}>
                {posts.map((post, index) => (
                    <Paper
                        key={post.postId || `fallback-${index}`}
                        elevation={2}
                        sx={{
                            p: 2,
                            borderLeft: "6px solid #1976d2",
                            transition: "0.3s",
                            "&:hover": { boxShadow: 4 },
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold">
                            #{index + 1} — {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Author: {post.author} • Views: {post.views} • Likes: {post.likes}
                        </Typography>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
};

export default TopPosts;
