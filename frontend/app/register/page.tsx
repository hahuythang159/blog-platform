'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../lib/authService';
import AuthLayout from '../components/layout/AuthLayout';
import { Typography, Box, Button, TextField } from '@mui/material';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout title="Sign up to LinkSoul">
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '450px', mx: 'auto' }}>
        <Typography
          sx={{
            fontFamily: '"Inknut Antiqua", serif',
            fontWeight: 'bold',
            color: '#ffffff',
            mb: 1,
            px: 2,
          }}
        >
          Email:
        </Typography>
        <TextField name="email" type="email" fullWidth onChange={handleChange} required variant="outlined"
          sx={{
            height: '3rem',
            backgroundColor: '#424C70',
            borderRadius: '20px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
            input: {
              color: '#ffffff',
              fontFamily: '"Inknut Antiqua", serif',
              fontWeight: 'bold',
            },
          }}
        />
        <Typography
          sx={{
            fontFamily: '"Inknut Antiqua", serif',
            fontWeight: 'bold',
            color: '#ffffff',
            mt: 2,
            mb: 1,
            px: 2,
          }}
        >
          Username:
        </Typography>
        <TextField name="username" type="text" fullWidth onChange={handleChange} required variant="outlined"
          sx={{
            height: '3rem',
            backgroundColor: '#424C70',
            borderRadius: '20px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
            input: {
              color: '#ffffff',
              fontFamily: '"Inknut Antiqua", serif',
              fontWeight: 'bold',
            },
          }} />
        <Typography
          sx={{
            fontFamily: '"Inknut Antiqua", serif',
            fontWeight: 'bold',
            color: '#ffffff',
            mt: 2,
            mb: 1,
            px: 2,
          }}
        >
          Password:
        </Typography>
        <TextField name="password" type='password' fullWidth onChange={handleChange} required variant="outlined"
          sx={{
            height: '3rem',
            backgroundColor: '#424C70',
            borderRadius: '20px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
            input: {
              color: '#ffffff',
              fontFamily: '"Inknut Antiqua", serif',
              fontWeight: 'bold',
            },
          }}
        />

        <Button type="submit" fullWidth variant="outlined"
          sx={{
            fontSize: '1.5rem',
            fontFamily: '"Inknut Antiqua", serif',
            fontWeight: 'bold',
            height: '3rem',
            mt: 5,
            color: '#ffffff',
            backgroundColor: '#3A73F4',
            borderRadius: 4,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#6796FF',
              color: '#E2D9D9',
            },
          }}
        >
          Create account
        </Button>
        
        {/* Error */}
        {error && (
          <Typography color="error" variant="body2" sx={{ pt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{
            height: '0.5px',
            width: '50%',
            backgroundColor: '#3A73F4',
            m: '30px auto 10px auto',
            borderRadius: 1,
          }}
        />
        <Typography
          onClick={() => router.push('/login')}
          sx={{
            fontFamily: 'serif',
            fontWeight: '',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ffffff',
          }}
        >
          Already registered? Sign in
        </Typography>
      </Box>
    </AuthLayout >
  );
};

export default RegisterPage;
