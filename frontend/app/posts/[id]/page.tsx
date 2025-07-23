'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removePost, setPost } from '@/app/store/postSlice';
import { RootState } from '@/app/store/store';
import { useParams, useRouter } from 'next/navigation';
import { usePostStats } from '@/app/hooks/usePostStats';
import { useViewTracker } from '@/app/hooks/useViewTracker';
import LikeButton from '@/app/components/post/LikeButton';
import { Comment } from '@/app/types';
import { deletePostById, getPostById } from '@/app/lib/postService';
import CommentList from '@/app/components/comment/CommentList';
import { getCommentsByPost } from '@/app/lib/commentsService';
import { useRecordInteraction } from '@/app/hooks/useRecordInteraction';

const PostDetailPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const postId = id as string;
  const post = useSelector((state: RootState) => state.post.post);
  const user = useSelector((state: RootState) => state.user.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const { stats, setStats } = usePostStats(postId);
  const { triggerInteraction } = useRecordInteraction();

  useViewTracker(postId);

  useEffect(() => {
    fetchPost();
    fetchComments();
    triggerInteraction(postId, 'view')
  }, [postId, triggerInteraction]);

  const fetchPost = async () => {
    try {
      const data = await getPostById(postId);
      dispatch(setPost(data));
    } catch (error: any) {
      // TODO: Currently logging errors to the console for development/debugging purposes.
      // This should be replaced with proper user-facing error handling (e.g., UI notification, toast) later.
      console.error(error);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByPost(postId);
      setComments(data);
    } catch (error) {
      // TODO: Currently logging errors to the console for development/debugging purposes.
      // This should be replaced with proper user-facing error handling (e.g., UI notification, toast) later.
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!user?.token) {
      alert('You must log in to continue!');
      return
    }
    try {
      const res = await deletePostById(postId, user.token);

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

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c._id !== commentId));
  };
  const handleAddComment = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
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

      {stats && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p>Views: {stats.views}</p>
          <LikeButton postId={postId} likedBy={stats.likes} setStats={setStats} />
        </div>
      )}
      <CommentList
        comments={comments}
        postId={postId}
        onDelete={handleDeleteComment}
        onAdd={handleAddComment}
      />
    </div>

  );
};

export default PostDetailPage;
