import { Hono, type Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Bindings } from "../types";
import { buildAuthUrl, exchangeCode, fetchGoogleUser, type GoogleConfig, type GoogleUser } from "../lib/google";
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

// 구글 로그인 시작~콜백 사이에 state를 보관하는 쿠키.
// 콜백의 state가 이 값과 같아야 우리가 시작한 로그인이다. (다른 사이트가 위조한 콜백 차단, CSRF 방지)
const GOOGLE_STATE_COOKIE = "google_oauth_state";
const GOOGLE_STATE_PATH = "/api/auth/google";

function googleConfig(c: Context<{ Bindings: Bindings }>): GoogleConfig {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = c.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error(
      "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI가 없습니다. 로컬은 server/.dev.vars, 배포는 wrangler secret put"
    );
  }
  return { clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, redirectUri: GOOGLE_REDIRECT_URI };
}

// 실패하면 로그인 페이지로 돌려보내고, 화면에 안내 문구를 띄운다. (LoginPage가 ?error= 를 읽음)
const loginFailed = (c: Context<{ Bindings: Bindings }>) => c.redirect("/login?error=google");

// GET /api/auth/google - 구글 로그인 시작 (구글 로그인 페이지로 리다이렉트)
auth.get("/google", (c) => {
  const config = googleConfig(c);
  const state = crypto.randomUUID();
  setCookie(c, GOOGLE_STATE_COOKIE, state, {
    path: GOOGLE_STATE_PATH,
    httpOnly: true,
    sameSite: "Lax", // 구글에서 돌아오는 최상위 GET 이동에는 Lax 쿠키가 실린다
    secure: new URL(c.req.url).protocol === "https:",
    maxAge: 60 * 10, // 10분 안에 로그인을 끝내야 함
  });
  return c.redirect(buildAuthUrl(config, state));
});

// GET /api/auth/google/callback - 구글 로그인 콜백
auth.get("/google/callback", async (c) => {
  const { code, state, error } = c.req.query();
  const savedState = getCookie(c, GOOGLE_STATE_COOKIE);
  deleteCookie(c, GOOGLE_STATE_COOKIE, { path: GOOGLE_STATE_PATH }); // 한 번 쓰면 폐기

  // 사용자가 구글 화면에서 취소했거나(error=access_denied), state가 다르면 중단
  if (error || !code || !state || !savedState || state !== savedState) {
    if (error) console.warn("구글 로그인 취소/오류:", error);
    else console.warn("구글 로그인 state 불일치");
    return loginFailed(c);
  }

  let googleUser: GoogleUser;
  try {
    const config = googleConfig(c);
    const accessToken = await exchangeCode(config, code);
    googleUser = await fetchGoogleUser(accessToken);
  } catch (err) {
    console.error(err);
    return loginFailed(c);
  }

  // 이메일로 기존 회원과 연결하므로, 구글이 소유를 확인한 이메일만 받는다.
  // (확인 안 된 이메일을 받으면 남의 이메일로 그 사람 계정에 로그인할 수 있음)
  if (!googleUser.email || !googleUser.email_verified) {
    console.warn("구글 이메일 미인증:", googleUser.sub);
    return loginFailed(c);
  }

  const email = googleUser.email.trim().toLowerCase();
  let user = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: number }>();

  // 처음 오는 구글 사용자면 자동 가입 (비밀번호 없음)
  // ON CONFLICT: 콜백이 거의 동시에 두 번 와도 UNIQUE 오류 없이 이미 만들어진 회원 id를 받는다
  if (!user) {
    const nickname = (googleUser.name?.trim() || email.split("@")[0]).slice(0, NICKNAME_MAX);
    user = await c.env.DB.prepare(
      `INSERT INTO users (email, nickname, provider) VALUES (?, ?, 'google')
       ON CONFLICT(email) DO UPDATE SET email = excluded.email
       RETURNING id`
    )
      .bind(email, nickname)
      .first<{ id: number }>();
  }

  await startSession(c, user!.id);
  return c.redirect("/");
});
