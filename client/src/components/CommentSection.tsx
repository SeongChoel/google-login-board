import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as commentApi from "../api/comments";
import { useAuth } from "../contexts/AuthContext";
import type { Comment } from "../types";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface Props {
  postId: number;
}

// 게시글 하단 댓글 영역. 댓글 목록 상태를 여기서 들고, 작성·수정·삭제 결과를 바로 반영한다.
export default function CommentSection({ postId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    commentApi
      .fetchComments(postId)
      .then((data) => !ignore && setComments(data))
      .catch((err: Error) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [postId]);

  const handleCreate = async (content: string) => {
    const created = await commentApi.createComment(postId, content);
    setComments((prev) => [...prev, created]);
  };

  const handleUpdate = async (id: number, content: string) => {
    const updated = await commentApi.updateComment(id, content);
    setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleDelete = async (id: number) => {
    await commentApi.deleteComment(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        댓글 {!loading && !error && <span className="text-slate-400">{comments.length}</span>}
      </h2>

      {loading ? (
        <p className="py-4 text-sm text-slate-400">불러오는 중...</p>
      ) : error ? (
        <p className="py-4 text-sm text-red-500">{error}</p>
      ) : (
        <CommentList comments={comments} onUpdate={handleUpdate} onDelete={handleDelete} />
      )}

      {user ? (
        <CommentForm onSubmit={handleCreate} />
      ) : (
        <p className="rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-500">
          댓글을 작성하려면{" "}
          <Link to="/login" className="font-medium text-slate-900 underline">
            로그인
          </Link>
          해 주세요.
        </p>
      )}
    </div>
  );
}
