import { Hono } from "hono";
import type { Bindings } from "../types";

export const comments = new Hono<{ Bindings: Bindings }>();

// GET /api/posts/:postId/comments - 댓글 목록 조회
// TODO: DB에서 postId에 해당하는 댓글 목록을 조회해 반환하세요.
comments.get("/:postId/comments", (c) => {
  const postId = c.req.param("postId");
  return c.json({ message: `TODO: 게시글(${postId}) 댓글 목록 조회 구현`, comments: [] });
});

// POST /api/posts/:postId/comments - 댓글 작성
// TODO: 로그인한 사용자만 작성 가능하도록 인증을 확인하고 DB에 저장하세요.
comments.post("/:postId/comments", (c) => {
  const postId = c.req.param("postId");
  return c.json({ message: `TODO: 게시글(${postId}) 댓글 작성 구현` }, 501);
});
