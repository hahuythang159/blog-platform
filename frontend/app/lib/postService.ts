import { fetcher, rawFetcher } from '@/app/utils/fetcher';

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