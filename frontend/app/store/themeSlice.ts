import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getToken } from '../utils/token';
import { ThemeMode, ThemeState } from '../types';

const savedTheme = typeof window !== 'undefined' ? getToken() : null;
const initialState: ThemeState = {
  mode: savedTheme === 'dark' ? 'dark' : 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
