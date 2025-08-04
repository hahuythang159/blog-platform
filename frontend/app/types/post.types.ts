import { Comment } from "./comments.types";
import { Tag } from "./tag.types";

export type Post = {
  _id: string;
  title: string;
  content: string;
  tags?: Tag[];
  author: {
    _id: string;
    username: string;
    avatarUrl: string;
  };
  comments?: Comment[];
  views: number;
  likes: string[];
  createdAt: string;
}
