'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import RequireLoginDialog from '@/app/components/auth/RequireLoginDialog';
import { createPost } from '@/app/lib/postService';

const CreatePostPage = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) {
      setShowLoginModal(true);
      return;
    }
    try {
      await createPost(user.token, form)
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
      <RequireLoginDialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title='Please log in'
        message='Please log in to share your feelings' />
    </div>
  );
};

export default CreatePostPage;
