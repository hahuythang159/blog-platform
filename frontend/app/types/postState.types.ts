import { Post } from "./post.types";

export type PostState = {
    allPosts: Post[]
    followingPosts: Post[]
    post: Post | null;
}