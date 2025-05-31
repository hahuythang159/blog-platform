'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { getPostById, updatePostById } from '@/app/lib/postService';

const EditPostPage = () => {
  const { id } = useParams();
  const postId = id as string;
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;
        const data = await getPostById(postId);
        setForm({ title: data.title, content: data.content });
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) {
      alert('You must log in to continue!');
      return;
    }
    if (!postId) return;

    try {
      await updatePostById(postId, user.token, form);
      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Edit your post</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" type="text" value={form.title} onChange={handleChange} required />
        <textarea name="content" value={form.content} onChange={handleChange} required />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPostPage;
