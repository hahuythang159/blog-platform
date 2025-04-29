import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostState } from '../interfaces/postState';
import { Post } from '../interfaces/post';

const initialState: PostState = {
  posts: [],
  post: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setPost: (state, action: PayloadAction<Post | null>) => {
      state.post = action.payload;
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
      if(state.post?._id === action.payload){
        state.post = null;
      }
    }
  },
});

export const { setPosts, setPost, removePost } = postSlice.actions;
export default postSlice.reducer;
