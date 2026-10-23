import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useConfirm } from "../contexts/ConfirmContext";
import type { Comment } from "../types";
import { formatDate } from "../utils/date";

interface Props {
  comment: Comment;
  onUpdate: (id: number, content: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function CommentItem({ comment, onUpdate, onDelete }: Props) {
  const { user } = useAuth();
  const confirm = useConfirm();
  const isMine = user?.id === comment.authorId;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = () => {
    setDraft(comment.content);
    setError(null);
    setEditing(true);
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onUpdate(comment.id, draft);
      setEditing(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!(await confirm({ message: "이 댓글을 삭제할까요?", confirmLabel: "삭제", danger: true }))) return;
    setBusy(true);
    setError(null);
    try {
      await onDelete(comment.id); // 성공하면 목록에서 빠지며 이 컴포넌트가 사라진다
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  const smallButton = "text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <li className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-none">
      <div className="flex items-center gap-3 text-sm">
        <strong className="font-semibold text-slate-900">{comment.author}</strong>
        <span className="text-slate-400">{formatDate(comment.createdAt)}</span>
        {isMine && !editing && (
          <div className="ml-auto flex gap-3">
            <button type="button" onClick={startEdit} disabled={busy} className={`${smallButton} text-slate-500 hover:text-slate-900`}>
              수정
            </button>
            <button type="button" onClick={handleDelete} disabled={busy} className={`${smallButton} text-red-500 hover:text-red-700`}>
              삭제
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <form className="flex flex-col gap-2" onSubmit={handleSave}>
          <textarea
            rows={2}
            required
            maxLength={1000}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 self-end">
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={busy}
              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {busy ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="whitespace-pre-wrap text-sm text-slate-700">{comment.content}</p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      )}
    </li>
  );
}
