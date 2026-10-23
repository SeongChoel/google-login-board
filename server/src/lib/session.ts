import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import type { Bindings } from "../types";

// 로그인 상태는 HttpOnly 쿠키에 담은 JWT로 유지한다. (JS에서 읽을 수 없어 XSS로 토큰이 새지 않음)
const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7일

// Variables가 있는 라우트(requireAuth 등)에서도 쓸 수 있도록 Bindings만 요구한다.
type Ctx<E extends { Bindings: Bindings }> = Context<E>;

function secretOf<E extends { Bindings: Bindings }>(c: Ctx<E>): string {
  const secret = c.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET이 없습니다. 로컬은 server/.dev.vars, 배포는 wrangler secret put JWT_SECRET");
  }
  return secret;
}

export async function startSession<E extends { Bindings: Bindings }>(c: Ctx<E>, userId: number) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const token = await sign({ sub: String(userId), exp }, secretOf(c), "HS256");
  setCookie(c, COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: new URL(c.req.url).protocol === "https:", // 로컬(http)에서는 끔
    maxAge: MAX_AGE,
  });
}

export function endSession<E extends { Bindings: Bindings }>(c: Ctx<E>) {
  deleteCookie(c, COOKIE_NAME, { path: "/" });
}

// 유효한 세션이면 사용자 id, 아니면(없음·위조·만료) null
export async function getSessionUserId<E extends { Bindings: Bindings }>(c: Ctx<E>): Promise<number | null> {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return null;
  const secret = secretOf(c); // 키 누락은 try 밖에서 그대로 오류로 드러나게
  try {
    const payload = await verify(token, secret, "HS256");
    return Number(payload.sub);
  } catch {
    return null;
  }
}
