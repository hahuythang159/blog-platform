import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState } from '../interfaces/theme';
import { ThemeMode } from '../types/themeMode';

const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
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
