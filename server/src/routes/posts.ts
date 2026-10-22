import { Hono } from "hono";
import type { Bindings } from "../types";

export const posts = new Hono<{ Bindings: Bindings }>();

// GET /api/posts - 게시글 목록 조회
// TODO: DB에서 게시글 목록을 조회해 반환하세요.
posts.get("/", (c) => {
  return c.json({ message: "TODO: 게시글 목록 조회 구현", posts: [] });
});

// GET /api/posts/:id - 게시글 상세 조회
// TODO: DB에서 id에 해당하는 게시글을 조회해 반환하세요.
posts.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ message: `TODO: 게시글(${id}) 상세 조회 구현`, post: null });
});

// POST /api/posts - 게시글 작성
// TODO: 로그인한 사용자만 작성 가능하도록 인증을 확인하고 DB에 저장하세요.
posts.post("/", (c) => {
  return c.json({ message: "TODO: 게시글 작성 구현" }, 501);
});
