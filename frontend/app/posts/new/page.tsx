'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { fetcher } from '@/app/utils/fetcher';

const CreatePostPage = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return alert('You must log in to continue!');
    try {
      await fetcher('posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(form),
      });
      router.push('/posts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create a new post</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Title" onChange={handleChange} required />
        <textarea name="content" placeholder="Content" onChange={handleChange} required />
        <button type="submit">Share</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
