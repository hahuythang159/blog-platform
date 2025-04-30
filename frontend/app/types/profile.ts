export type Profile = {
    userId: string;
    username: string;
    avatar?: string;
    bio?: string;
    gender?: string;
    followersCount: number;
    followingCount: number;
    postCount: number;
};