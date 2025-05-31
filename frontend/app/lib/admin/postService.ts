import { Post } from "@/app/types";
import { fetcher } from "@/app/utils/fetcher";
import { getToken } from "@/app/utils/token";

export const getAllPosts = async (): Promise<Post[]> => {
  const token = getToken();
  const data = await fetcher("admin/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
