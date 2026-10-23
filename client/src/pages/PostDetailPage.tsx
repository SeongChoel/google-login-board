import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { fetchPost } from "../api/posts";
import { formatDate } from "../utils/date";
import type { Post } from "../types";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const id = Number(postId);

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
        <div className="flex gap-4 text-sm text-slate-500">
          <span>작성자: {post.author}</span>
          <span>작성일: {formatDate(post.createdAt)}</span>
        </div>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="" className="max-h-96 w-full rounded-md object-contain" />
        )}
        <p className="min-h-24 whitespace-pre-wrap text-slate-700">{post.content}</p>
      </article>

      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">댓글</h2>
        <CommentList postId={id} />
        <CommentForm postId={id} />
      </div>
    </section>
  );
}
