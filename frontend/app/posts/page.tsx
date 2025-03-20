'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/app/store/postSlice';
import { RootState } from '@/app/store/store';
import { fetcher } from '@/app/utils/fetcher';
import Link from 'next/link';

const PostListPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.post.posts);
  const user = useSelector(( state: RootState) => state.user.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetcher('posts');
        dispatch(setPosts(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [dispatch]);

  return (
    <div>
      <h2>Community Posts</h2>
      <Link href="/posts/new">Create Your Own Post</Link>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link href={`/posts/${post._id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostListPage;
