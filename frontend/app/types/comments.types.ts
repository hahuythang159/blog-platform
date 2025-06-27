export type Comment = {
    _id: string;
    content: string;
    post: string;
    author: {
        _id: string;
        username: string;
        avatarUrl?: string;

    };
    createdAt: string;
    updatedAt: string;
}