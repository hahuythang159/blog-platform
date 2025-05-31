export type Comment = {
    _id: string;
    content: string;
    post: string;
    author: {
        _id: string;
        username: string;
        profile?: {
            avatarData?: string;
            avatarType?: string;
        };
    };
    createdAt: string;
    updatedAt: string;
}