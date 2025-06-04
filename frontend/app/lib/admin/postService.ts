import { Post } from "@/app/types";
import { fetcher } from "@/app/utils/fetcher";
import { getToken } from "@/app/utils/token";

/**
 * Fetches all posts from the admin endpoint.
 * Requires an authorization token (admin access).
 * This API is typically used for moderation, analytics, or administrative review.
 * 
 * @returns Promise resolving to an array of Post objects.
 */
export const getAllPosts = async (): Promise<Post[]> => {
  const token = getToken();
  const data = await fetcher("admin/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
