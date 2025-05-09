import { CreateCommentPayload } from "../interfaces/commentPayload";
import { Comment } from "../interfaces/comments";
import { fetcher, rawFetcher } from "../utils/fetcher";

export async function createComment(payload: CreateCommentPayload): Promise<Comment> {
    const token = localStorage.getItem('token');
  
    const data = await fetcher('comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  
    return data as Comment;
  }
  

export async function getCommentsByPost(postId: string): Promise<Comment[]> {
    const res = await fetcher(`comments/${postId}`);

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to load comments');
    }

    return res.json();
}

export async function deleteComment(commentId: string, token: string): Promise<any> {
    return await rawFetcher(`comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
