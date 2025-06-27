import { Post } from "./post.types";
import { Profile } from "./profile.types";

/**
 * Props for the FollowStats component.
 * Displays basic user statistics such as number of followers, followings, posts, and optionally gender.
 */
export interface FollowStatsProps {
    profile: Profile;
}

/**
 * Props for the FollowList component.
 * Used to render either the "Followers" or "Following" tab content.
 */
export type FollowListProps = {
    tab: 'followers' | 'following';
    followers: FollowUser[];
    following: FollowUser[];
    loadingList: boolean;
}

/**
 * Props for the FollowList component.
 * Used to render either the "Followers" or "Following" tab content.
 */
export type FollowUser = {
    userId: string;
    username: string;
    avatar: string;
}

/**
 * Props for the UserPosts component.
 * Displays a list of posts created by the given username.
 */
export type UserPostsProps = {
    posts: Post[];
    username: string;
}
