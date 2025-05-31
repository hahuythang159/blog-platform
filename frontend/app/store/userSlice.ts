import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../utils/token';
import { UserState } from '../types';

const token = typeof window !== "undefined" ? getToken() : null;
const decodedToken: any = token ? jwtDecode(token) : null;

const initialState: UserState = {
  user: token
    ? {
      _id: decodedToken?._id,
      username: decodedToken?.username,
      token,
    }
    : null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;

      try {
        const decode: any = jwtDecode(token);
        state.user = {
          _id: decode._id,
          username: decode.username,
          token,
        };

        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Invalid token', error);
        state.user = null;
      }
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    }
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
