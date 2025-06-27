import { fetcher } from '@/app/utils/fetcher';

/**
 * Fetch public profile data of a user by username
 * @param username - The username of the profile to fetch
 * @returns Promise resolving to the user's profile data
 */
export const getUserProfile = async (username: string) => {
  return await fetcher(`profile/${username}`);
};

/**
 * Fetch all posts created by a specific user
 * @param username - The username whose posts are to be fetched
 * @returns Promise resolving to an array of posts by the user
 */
export const getUserPosts = async (username: string) => {
  return await fetcher(`profile/${username}/posts`);
};

/**
 * Check whether the logged-in user (followerId) is following the specified username
 * @param username - The username to check following status for
 * @param followerId - The ID of the follower user (logged-in user)
 * @returns Promise resolving to a boolean or status indicating following state
 */
export const checkUserFollowing = async (username: string, followerId: string) => {
  return await fetcher(`profile/${username}/is-following?followerId=${followerId}`);
};

/**
 * Fetch a list of either followers or users that the specified username is following
 * @param username - The username whose follow list is requested
 * @param type - 'followers' to get followers list, 'following' to get the followed users list
 * @returns Promise resolving to an array of user profiles in the requested list
 */
export const getFollowList = async (username: string, type: 'followers' | 'following') => {
  return await fetcher(`profile/${username}/${type}`);
};

/**
 * Toggle the follow status for a specific user
 * 
 * Sends a POST request to follow or unfollow the specified user based on the current follow status.
 * 
 * @param username - The username of the user to follow or unfollow
 * @param followerId - The ID of the user performing the follow/unfollow action
 * @returns Promise resolving to the updated follow status or response data from the server
 * @throws Error if username or followerId is missing
 */
export const toggleFollowUser = async (username: string, followerId: string) => {
  if (!username || !followerId) throw new Error('Missing username or followerId');

  const data = await fetcher(`follow/${username}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ followerId }),
  });

  return data;
};