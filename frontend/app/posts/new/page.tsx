'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import RequireLoginDialog from '@/app/components/auth/RequireLoginDialog';
import { createPost } from '@/app/lib/postService';
import PostCard from '@/app/components/post/PostCard';

const CreatePostPage = () => {
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) {
      setShowLoginModal(true);
      return;
    }

    const tagsArray = form.tags.split(',').map(tags => tags.trim()).filter(tags => tags.length > 0);

    try {
      await createPost(user.token, {
        title: form.title,
        content: form.content,
        tags: tagsArray
      })
      router.push('/posts');
    } catch (error) {
      console.error(error);
    }
  };
  const handlePreview = () => {
    setShowPreview(true);
  };

  // Create a mock object of a post for preview
  const previewPost = {
    _id: 'preview-id',
    title: form.title,
    content: form.content,
    tags: form.tags.split(',').map(tag => ({ _id: tag, name: tag.trim(), slug: tag.trim().toLowerCase() })),
    createdAt: new Date().toISOString(),
    author: {
      _id: user?._id || 'preview-user-id',
      username: user?.username || 'PreviewUser'
    }
  };

  return (
    <div>
      <h2>Create a new post</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Title" onChange={handleChange} required />
        <textarea name="content" placeholder="Content" onChange={handleChange} required />
        <input name='tags' type='text' placeholder="Tags (comma separated)" onChange={handleChange} />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" onClick={handlePreview}>Preview</button>
          <button type="submit">Share</button>
        </div>
      </form>
      {showPreview && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginLeft: '1.5rem' }}>Preview</h3>
          <div
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              opacity: 0.8
            }}
          >
            <PostCard post={previewPost} />
          </div>
        </div>
      )}
      <RequireLoginDialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title='Please log in'
        message='Please log in to share your feelings' />
    </div>
  );
};

export default CreatePostPage;
