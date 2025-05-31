import { Post } from "./post.types";

export type PostState = {
    posts: Post[];
    post: Post | null;
}