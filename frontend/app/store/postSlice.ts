import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: { username: string, avatar: string };
}

interface PostState {
  posts: Post[];
  post: Post | null;
}

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
