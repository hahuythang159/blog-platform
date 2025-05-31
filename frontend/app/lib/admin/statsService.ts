import { Stats } from "@/app/types";
import { fetcher } from "@/app/utils/fetcher";
import { getToken } from "@/app/utils/token";

export const getSystemStats = async (): Promise<Stats> => {
  const token = getToken();
  const data = await fetcher("admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getTopPosts = async () => {
  const token = getToken();
  const data = await fetcher("admin/stats/top-posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
