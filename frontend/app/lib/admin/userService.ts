import { User } from "@/app/types";
import { fetcher, rawFetcher } from "@/app/utils/fetcher";
import { getToken } from "@/app/utils/token";

/**
 * Fetches the list of all users from the admin API.
 * Requires authorization token (admin access).
 * @returns Promise resolving to an array of User objects.
 */
export const getUserList = async (): Promise<User[]> => {
  const token = getToken();
  const data = await fetcher("admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

/**
 * Toggles a user's ban status via the admin API.
 * Sends a PATCH request to either ban or unban the specified user.
 * @param userId - ID of the user to ban/unban
 * @param reason - Optional reason for banning the user
 * @returns Promise resolving to an object indicating success, ban status, and optional reason.
 */
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
