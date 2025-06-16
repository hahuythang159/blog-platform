import { Comment } from "../types";

export interface CommentItemProps {
    comment: Comment;
    avatarUrl: string;
    isLoading: boolean;
    onDelete: (commentId: string) => void;
    currentUserId?: string;
}
