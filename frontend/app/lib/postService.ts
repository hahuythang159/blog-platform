import { fetcher, rawFetcher } from '@/app/utils/fetcher';
import { DeletePostResponse, Post, PostPayload } from '../types';

export const getPostStats = (postId: string) =>
    fetcher(`post-stats/${postId}`);

export const togglePostLike = (postId: string, token: string) =>
    rawFetcher(`post-stats/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json());

export const incrementPostView = (postId: string) =>
    rawFetcher(`post-stats/${postId}/view`, {
        method: 'POST'
    }).then(res => res.json());


export const getPostById = async (id: string): Promise<Post> => {
    const data = await fetcher(`posts/${id}`);
    return data;
}

export const deletePostById = async (id: string, token: string): Promise<DeletePostResponse> => {
    const data = await fetcher(`posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return data;
};

export const updatePostById = async (id: string, token: string, payload: PostPayload): Promise<Post> => {
    const data = await fetcher(`posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return data;
};

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

export const getPosts = async (): Promise<Post[]> => {
    const data = await fetcher('posts');
    return data;
}