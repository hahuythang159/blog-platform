'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/app/store/userSlice';
import { login } from '../lib/authService';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import AuthLayout from '../components/layout/AuthLayout';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStayLoggedIn(e.target.checked);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(form);

      // Handle token storage according to checkbox
      if (stayLoggedIn) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }

      dispatch(setUser({ token: data.token }));
      router.push('/posts');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout title="Sign in to LinkSoul">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: '380px',
          mx: 'auto',
        }}
      >
        {/* Email */}
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
        <TextField
          name="email"
          type="email"
          fullWidth
          onChange={handleChange}
          required
          variant="outlined"
          sx={{
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

        {/* Password */}
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
        <TextField
          name="password"
          type="password"
          fullWidth
          onChange={handleChange}
          required
          variant="outlined"
          sx={{
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
        {/* Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={stayLoggedIn}
              onChange={handleCheckBoxChange}
              sx={{
                color: 'white',
                mt: 2,
                px: 2,
                '&.Mui-checked': {
                  color: '#3A73F4',
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontFamily: '"Inknut Antiqua", serif',
                fontWeight: 'bold',
                color: 'white',
                mt: 2,
              }}
            >
              Stay logged in
            </Typography>
          }
        />

        {/* Error */}
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            fontSize: '1.3rem',
            fontFamily: '"Inknut Antiqua", serif',
            fontWeight: 'bold',
            mt: 2,
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
          Sign In
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 4,
            color: '#E9E9E9',
            fontFamily: '"Inknut Antiqua", serif',
            fontWeight: 'bold',
          }}
        >
          Don’t have an account?
        </Typography>

        <Typography
          onClick={() => router.push('/register')}
          sx={{
            fontSize: '1.5rem',
            fontFamily: '"Inknut Antiqua", serif',
            fontWeight: 'bold',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            mt: 1,
          }}
        >
          - Register -
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
