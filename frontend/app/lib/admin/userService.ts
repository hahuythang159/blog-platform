import { fetcher, rawFetcher } from "@/app/utils/fetcher";
import { getToken } from "@/app/utils/token";
import { User } from "@/app/interfaces/user";

export const getUserList = async (): Promise<User[]> => {
  const token = getToken();
  const data = await fetcher("admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const toggleBanStatus = async (userId: string, reason?: string): Promise<{
  success: boolean;
  isBanned: boolean;
  reason?: string;
}> => {
  try {
    const res = await rawFetcher(`admin/users/${userId}/ban`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: reason ? JSON.stringify({ reason }) : undefined,
    });

    if (res.status === 200) {
      const data = await res.json();
      return {
        success: true,
        isBanned: data.isBanned,
        reason: data.reason,
      };
    } else {
      return { success: false, isBanned: false };
    }
  } catch (err) {
    console.error("Failed to toggle ban:", err);
    return { success: false, isBanned: false };
  }
};
