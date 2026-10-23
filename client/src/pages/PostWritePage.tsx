import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { useAuth } from "../contexts/AuthContext";

// TODO: 이미지 업로드(R2)는 나중에 붙인다. 이미지를 먼저 업로드해 URL을 받은 뒤 게시글과 함께 저장하는 방식.
export default function PostWritePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const post = await createPost({ title, content });
      navigate(`/board/${post.id}`, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="py-12 text-center text-sm text-slate-400">불러오는 중...</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ notice: "로그인이 필요합니다." }} />;
  }

  const inputClass =
    "rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-700";

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">게시글 작성</h1>

      <form className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6" onSubmit={handleSubmit}>
        <label className={labelClass}>
          제목
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            required
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          내용
          <textarea
            name="content"
            rows={8}
            placeholder="내용을 입력하세요"
            required
            maxLength={10000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:self-start sm:px-8"
        >
          {submitting ? "저장 중..." : "작성 완료"}
        </button>
      </form>
    </section>
  );
}
