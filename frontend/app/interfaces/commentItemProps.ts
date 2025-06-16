import { Comment } from "../types";

export interface CommentItemProps {
    comment: Comment;
    avatarUrl: string;
    onDelete: (commentId: string) => void;
    currentUserId?: string;
}
