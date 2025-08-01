import { fetcher, rawFetcher } from '@/app/utils/fetcher';
import { DeletePostResponse, Post, PostPayload } from '../types';

/**
 * Fetch statistics of a post (likes, views, comments, etc.) by postId
 * @param postId - ID of the post
 * @returns Promise resolving to post statistics data
 */
export const getPostStats = async (postId: string) => {
    return await fetcher(`post-stats/${postId}`);
};

/**
 * Toggle like status on a post (like or unlike)
 * @param postId - ID of the post
 * @param token - User authentication token
 * @returns Promise resolving to the updated like status response
 */
export const togglePostLike = async (postId: string, token: string) => {
    const res = await rawFetcher(`post-stats/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return await res.json();
};

/**
 * Increment the view count of a post by 1
 * @param postId - ID of the post
 * @returns Promise resolving to the updated view count response
 */
export const incrementPostView = async (postId: string) => {
    const res = await rawFetcher(`post-stats/${postId}/view`, {
        method: 'POST',
    });
    return await res.json();
};

/**
 * Fetch detailed information of a post by its ID
 * @param id - ID of the post
 * @returns Promise resolving to the post data
 */
export const getPostById = async (id: string): Promise<Post> => {
    return await fetcher(`posts/${id}`);
};

/**
 * Delete a post by its ID
 * @param id - ID of the post to delete
 * @param token - User authentication token
 * @returns Promise resolving to the deletion response data
 */
export const deletePostById = async (id: string, token: string): Promise<DeletePostResponse> => {
    return await fetcher(`posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

/**
 * Update a post by its ID with new data
 * @param id - ID of the post to update
 * @param token - User authentication token
 * @param payload - Updated post data
 * @returns Promise resolving to the updated post data
 */
export const updatePostById = async (id: string, token: string, payload: PostPayload): Promise<Post> => {
    return await fetcher(`posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
};

/**
 * Create a new post
 * @param token - User authentication token
 * @param payload - New post data
 * @returns Promise resolving to void (no response data expected)
 */
export const createPost = async (token: string, payload: PostPayload): Promise<void> => {
    await fetcher('posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
};

/**
 * Fetch all posts
 * @returns Promise resolving to an array of posts
 */
export const getPosts = async (): Promise<Post[]> => {
    return await fetcher('posts');
};

/**
 * Fetch posts filtered by a specific tag slug.
 * 
 * @param tagSlug - The slug of the tag to filter posts by (e.g. "javascript")
 * @returns Promise resolving to an array of posts associated with the tag
 */
export const getPostsByTagSlug = async (tagSlug: string): Promise<Post[]> => {
    const query = new URLSearchParams({ tag: tagSlug });
    return await fetcher(`posts?${query.toString()}`);
}

/**
 * Fetch posts from users the current user is following.
 * Requires authentication token.
 * @returns Promise resolving to an array of posts
 */
export const getFollowingPosts = async (): Promise<Post[]> => {
    const res = await rawFetcher('posts/following', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch following posts');
    }

    const data = await res.json();
    return data;
};