'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { fetcher } from '@/app/utils/fetcher';

const EditPostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await fetcher(`posts/${id}`);
        setForm({ title: data.title, content: data.content });
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return alert('You must log in to continue!');
    try {
      await fetcher(`posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(form),
      });
      router.push(`/posts/${id}`);
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
