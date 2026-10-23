import { createMiddleware } from "hono/factory";
import type { Bindings } from "../types";
import { getSessionUserId } from "../lib/session";

export type AuthEnv = {
  Bindings: Bindings;
  Variables: { userId: number };
};

// 로그인한 사용자만 통과시킨다. 통과하면 c.get("userId")로 사용자 id를 쓸 수 있다.
export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const userId = await getSessionUserId(c);
  // 토큰은 유효해도 그사이 탈퇴(삭제)된 회원일 수 있으므로 DB에서 한 번 더 확인
  const exists = userId
    ? await c.env.DB.prepare("SELECT 1 FROM users WHERE id = ?").bind(userId).first()
    : null;
  if (!exists) {
    return c.json({ message: "로그인이 필요합니다." }, 401);
  }

  c.set("userId", userId!);
  await next();
});
