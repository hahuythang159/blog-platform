import { AuthRequest } from "../types/customRequest";

export const getAuthUserId = (req: AuthRequest): string => {
  if (!req.user) {
    throw new Error("Unauthorized: user not found");
  }
  return req.user._id.toString();
};
