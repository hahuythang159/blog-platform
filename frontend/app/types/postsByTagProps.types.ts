import { Post } from "./post.types";

export type PostsByTagProps = {
    posts: Post[];
    tagSlug: string;
}
