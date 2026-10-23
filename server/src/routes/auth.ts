import { Hono } from "hono";
import type { Bindings } from "../types";
import { hashPassword, verifyPassword } from "../lib/password";
import { endSession, getSessionUserId, startSession } from "../lib/session";

export const auth = new Hono<{ Bindings: Bindings }>();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;
const NICKNAME_MAX = 20;

// POST /api/auth/signup - 사이트 자체 회원가입
auth.post("/signup", async (c) => {
  const body = await c.req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const nickname = typeof body?.nickname === "string" ? body.nickname.trim() : "";

  if (!EMAIL_PATTERN.test(email)) {
    return c.json({ message: "올바른 이메일을 입력해 주세요." }, 400);
  }
  if (password.length < PASSWORD_MIN) {
    return c.json({ message: `비밀번호는 ${PASSWORD_MIN}자 이상이어야 합니다.` }, 400);
  }
  if (!nickname || nickname.length > NICKNAME_MAX) {
    return c.json({ message: `닉네임은 1~${NICKNAME_MAX}자로 입력해 주세요.` }, 400);
  }

  const exists = await c.env.DB.prepare("SELECT 1 FROM users WHERE email = ?").bind(email).first();
  if (exists) {
    return c.json({ message: "이미 가입된 이메일입니다." }, 409);
  }

  const passwordHash = await hashPassword(password);
  try {
    const user = await c.env.DB.prepare(
      `INSERT INTO users (email, password_hash, nickname, provider)
       VALUES (?, ?, ?, 'local')
       RETURNING id, email, nickname`
    )
      .bind(email, passwordHash, nickname)
      .first();
    return c.json({ user }, 201);
  } catch (err) {
    // 위 확인과 INSERT 사이에 같은 이메일로 동시에 가입한 경우
    if (String(err).includes("UNIQUE constraint failed")) {
      return c.json({ message: "이미 가입된 이메일입니다." }, 409);
    }
    throw err;
  }
});

// POST /api/auth/login - 사이트 자체 로그인 (성공 시 JWT 쿠키 발급)
auth.post("/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return c.json({ message: "이메일과 비밀번호를 입력해 주세요." }, 400);
  }

  const user = await c.env.DB.prepare(
    "SELECT id, email, nickname, password_hash FROM users WHERE email = ?"
  )
    .bind(email)
    .first<{ id: number; email: string; nickname: string; password_hash: string | null }>();

  // 구글 가입 회원은 password_hash가 없다.
  // 없는 이메일이어도 해시를 한 번 계산해, 응답 시간으로 가입 여부가 드러나지 않게 한다.
  const valid = user?.password_hash
    ? await verifyPassword(password, user.password_hash)
    : (await hashPassword(password), false);
  if (!user || !valid) {
    return c.json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." }, 401);
  }

  await startSession(c, user.id);
  return c.json({ user: { id: user.id, email: user.email, nickname: user.nickname } });
});

// GET /api/auth/me - 현재 로그인한 사용자 (비로그인이면 user: null)
auth.get("/me", async (c) => {
  const userId = await getSessionUserId(c);
  const user = userId
    ? await c.env.DB.prepare("SELECT id, email, nickname FROM users WHERE id = ?").bind(userId).first()
    : null;
  return c.json({ user });
});

// POST /api/auth/logout - 로그아웃 (JWT 쿠키 삭제)
auth.post("/logout", (c) => {
  endSession(c);
  return c.json({ ok: true });
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
