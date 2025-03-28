'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removePost, setPost } from '@/app/store/postSlice';
import { RootState } from '@/app/store/store';
import { fetcher } from '@/app/utils/fetcher';
import { useParams, useRouter } from 'next/navigation';

const PostDetailPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const postId = id as string;
  const post = useSelector((state: RootState) => state.post.post);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await fetcher(`api/posts/${id}`);
        dispatch(setPost(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!user?.token) {
      alert('You must log in to continue!');
      return
    }
    try {
      const res = await fetcher(`api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      //Case status 204 No Content
      if (res === null) {
        dispatch(removePost(postId));
        alert('Deleted successfully!');
        router.push('/posts');
        return;
      }

      dispatch(removePost(postId));
      alert(res.message || 'Deleted successfully!');
      router.push('/posts');
    } catch (error) {
      console.error(error);
      alert('Something went wrong!');
    }
  };

  if (!post) return <p>Loading...</p>;

  

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>Author: {post.author.username}</p>
      {user && post.author.username === user.username && (
        <>
          <button onClick={() => router.push(`/posts/edit/${id}`)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default PostDetailPage;
