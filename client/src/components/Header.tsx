import { useState } from "react";
import { Link } from "react-router-dom";

// TODO: 로그인 상태에 따라 "로그인/회원가입" <-> "로그아웃" 표시를 전환하세요.
export default function Header() {
  const isLoggedIn = false;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass =
    "text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors";

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
          한코딩 게시판
        </Link>

        {/* 데스크톱 내비게이션 */}
        <nav className="hidden items-center gap-6 sm:flex">
          <Link to="/" className={navLinkClass}>
            게시판
          </Link>
          {isLoggedIn ? (
            <button
              type="button"
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
              onClick={() => {
                // TODO: 로그아웃 API 호출 후 상태 갱신
                console.log("TODO: 로그아웃 처리");
              }}
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link to="/login" className={navLinkClass}>
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>

        {/* 모바일 메뉴 토글 */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 sm:hidden"
          aria-label="메뉴 열기"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* 모바일 내비게이션 */}
      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
          <Link to="/" className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            게시판
          </Link>
          {isLoggedIn ? (
            <button
              type="button"
              className="rounded-md px-2 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => {
                console.log("TODO: 로그아웃 처리");
              }}
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                로그인
              </Link>
              <Link to="/signup" className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                회원가입
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
