import { FormEvent } from "react";

interface Props {
  postId: number;
}

// TODO: 입력값을 상태로 관리하고, 제출 시 댓글 작성 API를 호출하세요.
export default function CommentForm({ postId }: Props) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("TODO: 댓글 등록 처리", postId);
  };

  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-start" onSubmit={handleSubmit}>
      <textarea
        placeholder="댓글을 입력하세요"
        rows={2}
        className="flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors sm:self-stretch"
      >
        댓글 등록
      </button>
    </form>
  );
}
