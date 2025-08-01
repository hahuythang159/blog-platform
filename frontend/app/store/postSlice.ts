import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, PostState } from '../types';

const initialState: PostState = {
  allPosts: [],
  followingPosts: [],
  post: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setAllPosts: (state, action: PayloadAction<Post[]>) => {
      state.allPosts = action.payload;
    },
    setFollowingPosts: (state, action: PayloadAction<Post[]>) => {
      state.followingPosts = action.payload;
    },
    setPost: (state, action: PayloadAction<Post | null>) => {
      state.post = action.payload;
    },
    removePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.allPosts = state.allPosts.filter(post => post._id !== postId);
      state.followingPosts = state.followingPosts.filter(post => post._id !== postId);
      if (state.post?._id === postId) {
        state.post = null;
      }
    },
  },
});

export const { setAllPosts, setFollowingPosts, setPost, removePost } = postSlice.actions;
export default postSlice.reducer;
