import type { Comment } from "../types";

interface Props {
  comment: Comment;
}

export default function CommentItem({ comment }: Props) {
  return (
    <li className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-none">
      <div className="flex items-center gap-3 text-sm">
        <strong className="font-semibold text-slate-900">{comment.author}</strong>
        <span className="text-slate-400">{comment.createdAt}</span>
      </div>
      <p className="text-sm text-slate-700">{comment.content}</p>
    </li>
  );
}
