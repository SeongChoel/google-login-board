import { Link } from "react-router-dom";
import PostList from "../components/PostList";

// TODO: 로그인하지 않은 사용자는 글쓰기 버튼을 못 누르게(또는 로그인 페이지로 유도) 처리하세요.
export default function BoardPage() {
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
      <PostList />
    </section>
  );
}
