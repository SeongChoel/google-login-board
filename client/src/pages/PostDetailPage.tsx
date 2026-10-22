import { useParams } from "react-router-dom";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

// TODO: postId로 API를 호출해 실제 게시글 데이터를 불러오세요.
export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const id = Number(postId);

  return (
    <section className="flex flex-col gap-8">
      <article className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-slate-900">게시글 제목 (임시)</h1>
        <div className="flex gap-4 text-sm text-slate-500">
          <span>작성자: 임시</span>
          <span>작성일: 2026-07-20</span>
        </div>
        <p className="min-h-24 whitespace-pre-wrap text-slate-700">
          본문 내용이 들어갈 자리입니다.
        </p>
      </article>

      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">댓글</h2>
        <CommentList postId={id} />
        <CommentForm postId={id} />
      </div>
    </section>
  );
}
