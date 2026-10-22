import { Hono } from "hono";
import type { Bindings } from "../types";

export const auth = new Hono<{ Bindings: Bindings }>();

// POST /api/auth/signup - 사이트 자체 회원가입
// TODO: 이메일 중복 확인, 비밀번호 해시 처리 후 DB에 저장하세요.
auth.post("/signup", (c) => {
  return c.json({ message: "TODO: 회원가입 구현" }, 501);
});

// POST /api/auth/login - 사이트 자체 로그인
// TODO: 이메일/비밀번호 검증 후 세션 또는 JWT를 발급하세요.
auth.post("/login", (c) => {
  return c.json({ message: "TODO: 로그인 구현" }, 501);
});

// POST /api/auth/logout - 로그아웃
// TODO: 세션 또는 토큰을 무효화하세요.
auth.post("/logout", (c) => {
  return c.json({ message: "TODO: 로그아웃 구현" }, 501);
});

// GET /api/auth/google - 구글 로그인 시작 (인가 코드 요청 페이지로 리다이렉트)
// TODO: GOOGLE_CLIENT_ID, redirect_uri를 이용해 구글 인가 URL로 리다이렉트하세요.
// 참고: https://developers.google.com/identity/protocols/oauth2
auth.get("/google", (c) => {
  return c.json({ message: "TODO: 구글 로그인 시작(인가 코드 요청) 구현" }, 501);
});

// GET /api/auth/google/callback - 구글 로그인 콜백
// TODO: 인가 코드로 토큰을 발급받고, 사용자 정보 조회 후 회원가입/로그인 처리하세요.
auth.get("/google/callback", (c) => {
  return c.json({ message: "TODO: 구글 로그인 콜백 처리 구현" }, 501);
});
