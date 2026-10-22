import type { Comment } from "../types";
import CommentItem from "./CommentItem";

// TODO: postId를 이용해 API에서 댓글 목록을 불러오도록 구현하세요.
const DUMMY_COMMENTS: Comment[] = [
  { id: 1, postId: 1, author: "학생3", content: "댓글 예시입니다", createdAt: "2026-07-19" },
];

interface Props {
  postId: number;
}

export default function CommentList({ postId }: Props) {
  const comments = DUMMY_COMMENTS.filter((c) => c.postId === postId);

  if (comments.length === 0) {
    return <p className="py-4 text-sm text-slate-400">아직 댓글이 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}
