import { Comment } from "./comments";

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
    profile: {
      avatarData?: string;
      avatarType?: string;
    };
  };
  comments?: Comment[];
}
