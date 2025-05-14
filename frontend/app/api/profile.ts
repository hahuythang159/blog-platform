import { fetcher, rawFetcher } from '@/app/utils/fetcher';

// Fetch the user's profile data
export const getProfilePublic = async (username: string) => {
  return await fetcher(`profile/${username}`);
};

// Fetch the user's posts
export const getUserPosts = async (username: string) => {
  return await fetcher(`profile/${username}/posts`);
};

// Check if the logged-in user is following the profile
export const checkFollowingStatus = async (username: string, followerId: string) => {
  return await fetcher(`profile/${username}/is-following?followerId=${followerId}`);
};

// Fetch the followers or following list
export const getFollowList = async (username: string, type: 'followers' | 'following') => {
  return await fetcher(`profile/${username}/${type}`);
};