import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostList from "../components/PostList";
import { fetchPosts } from "../api/posts";
import type { Post } from "../types";

// TODO: 로그인하지 않은 사용자는 글쓰기 버튼을 못 누르게(또는 로그인 페이지로 유도) 처리하세요.
export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false; // 언마운트 뒤 늦게 온 응답은 무시
    fetchPosts()
      .then((data) => !ignore && setPosts(data))
      .catch((err: Error) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">게시판</h1>
        <Link
          to="/board/write"
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          글쓰기
        </Link>
      </div>
      {loading ? (
        <p className="py-8 text-center text-sm text-slate-400">불러오는 중...</p>
      ) : error ? (
        <p className="py-8 text-center text-sm text-red-500">{error}</p>
      ) : (
        <PostList posts={posts} />
      )}
    </section>
  );
}
