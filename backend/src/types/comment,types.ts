export interface Author {
    _id: string;
    username: string;
    avatarUrl?: string;
}

export interface PopulatedComment {
    _id: string;
    content: string;
    post: string;
    author: Author;
    createdAt: Date;
    updatedAt: Date;
}
