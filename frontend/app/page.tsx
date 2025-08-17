'use client';

import { Container, Typography, Box, Button, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import whyLinkSoulItems from './data/whyLinkSoul';

export default function Home() {
  const router = useRouter();
  const friendlyGreen = "#66bb6a";
  const friendlyGreenHover = "#5aa85b";
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box
        sx={{
          background: 'linear-gradient(to right, #1976d2, #42a5f5)',
          color: 'white',
          borderRadius: 4,
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Welcome to LinkSoul
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
            Share your thoughts, follow people, and stay connected.
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/posts')}
              sx={{
                backgroundColor: '#66bb6a',
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#5aa85b',
                },
              }}
            >
              Explore Posts
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => router.push('/login')}
              sx={{
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Login
            </Button>
          </Box>
        </motion.div>
      </Box>

      <Box sx={{ mt: 10 }}>
        <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold">
          Why LinkSoul?
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="center"
          alignItems="stretch"
          gap={4}
          mt={4}
        >
          {whyLinkSoulItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                flex: 1,
                background: theme.palette.background.paper,
                padding: '24px',
                borderRadius: '12px',
                boxShadow: theme.shadows[2],
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {item.title}
              </Typography>
              <Typography color="text.secondary">{item.desc}</Typography>
            </motion.div>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 12, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Join hundreds of users sharing their soul every day.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/register')}
          sx={{
            backgroundColor: friendlyGreen,
            borderRadius: 8,
            mt: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: friendlyGreenHover,
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
}
