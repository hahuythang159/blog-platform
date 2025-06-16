import { Comment } from '../types/comments.types';

export interface CommentListProps {
  comments: Comment[];
  postId: string;
  onDelete: (commentId: string) => void;
  onAdd: (newComment: Comment) => void;
}
