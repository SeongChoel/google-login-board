import { FormEvent } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";

// TODO: 입력값 상태 관리 및 로그인 API 호출을 구현하세요.
export default function LoginPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("TODO: 로그인 처리");
  };

  const inputClass =
    "rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-700";

  return (
    <section className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">로그인</h1>

      <form className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6" onSubmit={handleSubmit}>
        <label className={labelClass}>
          이메일
          <input type="email" name="email" placeholder="example@example.com" className={inputClass} />
        </label>
        <label className={labelClass}>
          비밀번호
          <input type="password" name="password" className={inputClass} />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          로그인
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
