import { FormEvent, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  // 로그인이 필요한 페이지에서 넘어왔을 때(예: 글쓰기), 또는 구글 로그인이 실패해 돌아왔을 때의 안내 문구
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const notice =
    searchParams.get("error") === "google"
      ? "구글 로그인에 실패했습니다. 다시 시도해 주세요."
      : (location.state as { notice?: string } | null)?.notice;
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  };

  const inputClass =
    "rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-700";

  return (
    <section className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">로그인</h1>

      {notice && (
        <p role="alert" className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </p>
      )}

      <form className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6" onSubmit={handleSubmit}>
        <label className={labelClass}>
          이메일
          <input
            type="email"
            name="email"
            placeholder="example@example.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          비밀번호
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        또는
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <GoogleLoginButton />
    </section>
  );
}
