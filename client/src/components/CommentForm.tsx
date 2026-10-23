import { FormEvent, useState } from "react";

interface Props {
  onSubmit: (content: string) => Promise<void>;
}

export default function CommentForm({ onSubmit }: Props) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(content);
      setContent("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <textarea
          placeholder="댓글을 입력하세요"
          rows={2}
          required
          maxLength={1000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:self-stretch"
        >
          {submitting ? "등록 중..." : "댓글 등록"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
