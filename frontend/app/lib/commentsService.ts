import { Comment, CreateCommentPayload } from "../types";
import { fetcher, rawFetcher } from "../utils/fetcher";
import { getToken } from "../utils/token";

/**
 * Create a new comment using the provided payload.
 * Sends a POST request with authorization token.
 * @param payload - Data for creating the comment
 * @returns Promise resolving to the created Comment object
 */
export async function createComment(payload: CreateCommentPayload): Promise<Comment> {
    const token = getToken();
  
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
  
/**
 * Fetch all comments related to a specific post by postId.
 * Throws an error if the fetch fails.
 * @param postId - The ID of the post to get comments for
 * @returns Promise resolving to an array of Comment objects
 */
export async function getCommentsByPost(postId: string): Promise<Comment[]> {
    const res = await fetcher(`comments/${postId}`);

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to load comments');
    }

    return res.json();
}

/**
 * Delete a comment by its ID, requires authorization token.
 * @param commentId - ID of the comment to delete
 * @param token - Authorization token
 * @returns Promise resolving to response from delete operation
 */
export async function deleteComment(commentId: string, token: string): Promise<any> {
    return await rawFetcher(`comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
