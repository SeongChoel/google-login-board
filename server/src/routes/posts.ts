import { Hono } from "hono";
import { requireAuth, type AuthEnv } from "../middleware/requireAuth";

export const posts = new Hono<AuthEnv>();

// posts + 작성자(users)를 조인해 client의 Post 타입(camelCase) 모양으로 꺼낸다.
// created_at은 UTC로 저장되므로 끝에 Z를 붙인 ISO 문자열로 내려준다.
const POST_SELECT = `
  SELECT p.id, p.title, p.content, p.image_url AS imageUrl,
         p.author_id AS authorId, u.nickname AS author,
         strftime('%Y-%m-%dT%H:%M:%SZ', p.created_at) AS createdAt
  FROM posts p
  JOIN users u ON u.id = p.author_id`;

// GET /api/posts - 게시글 목록 조회 (최신순)
posts.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `${POST_SELECT} ORDER BY p.created_at DESC, p.id DESC`
  ).all();
  return c.json({ posts: results });
});

// GET /api/posts/:id - 게시글 상세 조회
posts.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ message: "잘못된 게시글 번호입니다." }, 400);
  }

  const post = await c.env.DB.prepare(`${POST_SELECT} WHERE p.id = ?`).bind(id).first();
  if (!post) {
    return c.json({ message: "게시글을 찾을 수 없습니다." }, 404);
  }
  return c.json({ post });
});

const TITLE_MAX = 100;
const CONTENT_MAX = 10_000;

// POST /api/posts - 게시글 작성 (로그인 필요)
// TODO: 이미지 업로드(R2)를 붙이면 image_url도 함께 저장하세요.
posts.post("/", requireAuth, async (c) => {
  const body = await c.req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!title || title.length > TITLE_MAX) {
    return c.json({ message: `제목은 1~${TITLE_MAX}자로 입력해 주세요.` }, 400);
  }
  if (!content || content.length > CONTENT_MAX) {
    return c.json({ message: `내용은 1~${CONTENT_MAX.toLocaleString()}자로 입력해 주세요.` }, 400);
  }

  const created = await c.env.DB.prepare(
    "INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?) RETURNING id"
  )
    .bind(title, content, c.get("userId"))
    .first<{ id: number }>();
  const post = await c.env.DB.prepare(`${POST_SELECT} WHERE p.id = ?`).bind(created!.id).first();
  return c.json({ post }, 201);
});
