import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteComment, createComment } from '../lib/commentsService';
import { RootState } from '../store/store';
import { CommentListProps } from '../interfaces/commentListProps';
import { getAvatarUrl } from '../lib/avatarService';

const PostCommentList: React.FC<CommentListProps> = ({ comments, onDelete, onAdd, postId }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const currentUserId = user?._id;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarUrls, setAvatarUrls] = useState<{ [userId: string]: string }>({});

  useEffect(() => {
    const loadAvatars = async () => {
      const newAvatars: { [userId: string]: string } = {};

      await Promise.all(
        comments.map(async (comment) => {
          const userId = comment.author._id;
          if (!avatarUrls[userId]) {
            const url = await getAvatarUrl(userId);
            if (url) newAvatars[userId] = url;
          }
        })
      );

      setAvatarUrls((prev) => ({ ...prev, ...newAvatars }));
    };

    if (comments.length > 0) {
      loadAvatars();
    }
  }, [comments]);

  const handleDelete = async (commentId: string) => {
    if (!user?.token) return alert('Please log in');

    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    try {
      await deleteComment(commentId, user.token);
      if (onDelete) onDelete(commentId);
    } catch (error: any) {
      alert(error.message || 'Failed to delete comment');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return alert('Please log in');
    if (!content.trim()) return alert('Comment cannot be empty');
    setLoading(true);
    try {
      const newComment = await createComment({ postId, content });
      if (onAdd) onAdd(newComment);
      setContent('');
    } catch (error: any) {
      alert(error.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Comments</h3>

      {comments.length === 0 && <p>No comments yet.</p>}

      {comments.map((comment) => (
        <div key={comment._id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={avatarUrls[comment.author._id]}
                alt="avatar"
                style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }}
              />
              <strong>{comment.author.username}</strong>
            </div>
            {comment.author._id === currentUserId && (
              <button
                onClick={() => handleDelete(comment._id)}
                style={{ background: 'red', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
              >
                Delete
              </button>
            )}
          </div>
          <p>{comment.content}</p>
        </div>
      ))}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Write a comment..."
          style={{ width: '100%', padding: 8, borderRadius: 4 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            backgroundColor: '#0070f3',
            color: '#fff',
            padding: '6px 12px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default PostCommentList;
