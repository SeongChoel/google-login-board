import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { deletePost, fetchPost } from "../api/posts";
import { useAuth } from "../contexts/AuthContext";
import { useConfirm } from "../contexts/ConfirmContext";
import { formatDate } from "../utils/date";
import type { Post } from "../types";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const id = Number(postId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const confirm = useConfirm();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false; // 다른 글로 이동한 뒤 늦게 온 응답은 무시
    setPost(null);
    setError(null);
    fetchPost(id)
      .then((data) => !ignore && setPost(data))
      .catch((err: Error) => !ignore && setError(err.message));
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleDelete = async () => {
    const ok = await confirm({
      message: "이 게시글을 삭제할까요?\n삭제하면 댓글도 함께 지워지며 되돌릴 수 없습니다.",
      confirmLabel: "삭제",
      danger: true,
    });
    if (!ok) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deletePost(id);
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError((err as Error).message);
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <section className="flex flex-col items-center gap-4 py-12">
        <p className="text-sm text-red-500">{error}</p>
        <Link to="/" className="text-sm text-slate-600 underline hover:text-slate-900">
          목록으로
        </Link>
      </section>
    );
  }

  if (!post) {
    return <p className="py-12 text-center text-sm text-slate-400">불러오는 중...</p>;
  }

  return (
    <section className="flex flex-col gap-8">
      <article className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
          {user?.id === post.authorId && (
            <div className="flex shrink-0 gap-2">
              <Link
                to={`/board/${post.id}/edit`}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          )}
        </div>
        {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
        <div className="flex gap-4 text-sm text-slate-500">
          <span>작성자: {post.author}</span>
          <span>작성일: {formatDate(post.createdAt)}</span>
        </div>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="" className="max-h-96 w-full rounded-md object-contain" />
        )}
        <p className="min-h-24 whitespace-pre-wrap text-slate-700">{post.content}</p>
      </article>

      <CommentSection postId={id} />
    </section>
  );
}
