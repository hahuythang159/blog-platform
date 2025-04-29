import { Post } from "./post";

export interface PostState {
    posts: Post[];
    post: Post | null;
}