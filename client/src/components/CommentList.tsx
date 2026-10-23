import type { Comment } from "../types";
import CommentItem from "./CommentItem";

interface Props {
  comments: Comment[];
  onUpdate: (id: number, content: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function CommentList({ comments, onUpdate, onDelete }: Props) {
  if (comments.length === 0) {
    return <p className="py-4 text-sm text-slate-400">아직 댓글이 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
