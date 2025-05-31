import { Comment } from "./comments.types";

export type Post = {
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
  views: number;
  likes: string[];
  createdAt: string;
}
