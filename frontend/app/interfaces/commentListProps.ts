import { Comment } from './comments';

export interface CommentListProps {
  comments: Comment[];
  postId: string;
  onDelete?: (commentId: string) => void;
  onAdd?: (comment: Comment) => void;
}
