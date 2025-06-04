import { Stats } from "@/app/types";
import { fetcher } from "@/app/utils/fetcher";
import { getToken } from "@/app/utils/token";

/**
 * Fetches overall system statistics from the admin API.
 * Requires authorization token (admin access).
 * @returns Promise resolving to a Stats object containing system-wide metrics.
 */
export const getSystemStats = async (): Promise<Stats> => {
  const token = getToken();
  const data = await fetcher("admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

/**
 * Retrieves the list of top-performing posts from the admin statistics endpoint.
 * Typically sorted by metrics like views, likes, or engagement.
 * @returns Promise resolving to an array of top posts (structure depends on backend response).
 */
export const getTopPosts = async () => {
  const token = getToken();
  const data = await fetcher("admin/stats/top-posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
