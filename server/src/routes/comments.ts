import { Hono, type Context } from "hono";
import { requireAuth, type AuthEnv } from "../middleware/requireAuth";

// /api 아래에 붙인다. (/api/posts/:postId/comments 와 /api/comments/:id 를 함께 다룸)
export const comments = new Hono<AuthEnv>();

// comments + 작성자(users)를 조인해 client의 Comment 타입(camelCase) 모양으로 꺼낸다.
const COMMENT_SELECT = `
  SELECT c.id, c.post_id AS postId, c.content,
         c.author_id AS authorId, u.nickname AS author,
         strftime('%Y-%m-%dT%H:%M:%SZ', c.created_at) AS createdAt
  FROM comments c
  JOIN users u ON u.id = c.author_id`;

const CONTENT_MAX = 1_000;

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// 작성·수정 요청 본문 검사. 문제가 있으면 error에 안내 문구를 담는다.
async function parseContent(c: Context<AuthEnv>) {
  const body = await c.req.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content || content.length > CONTENT_MAX) {
    return { error: `댓글은 1~${CONTENT_MAX.toLocaleString()}자로 입력해 주세요.` } as const;
  }
  return { content } as const;
}

// 수정·삭제 전 확인: 잘못된 번호 400, 없는 댓글 404, 남의 댓글 403. 통과하면 null.
async function checkOwner(c: Context<AuthEnv>, id: number | null) {
  if (id === null) {
    return c.json({ message: "잘못된 댓글 번호입니다." }, 400);
  }
  const row = await c.env.DB.prepare("SELECT author_id FROM comments WHERE id = ?")
    .bind(id)
    .first<{ author_id: number }>();
  if (!row) {
    return c.json({ message: "댓글을 찾을 수 없습니다." }, 404);
  }
  if (row.author_id !== c.get("userId")) {
    return c.json({ message: "본인이 작성한 댓글만 수정·삭제할 수 있습니다." }, 403);
  }
  return null;
}

// GET /api/posts/:postId/comments - 댓글 목록 (오래된 순, 로그인 불필요)
comments.get("/posts/:postId/comments", async (c) => {
  const postId = parseId(c.req.param("postId"));
  if (postId === null) {
    return c.json({ message: "잘못된 게시글 번호입니다." }, 400);
  }
  const { results } = await c.env.DB.prepare(
    `${COMMENT_SELECT} WHERE c.post_id = ? ORDER BY c.created_at, c.id`
  )
    .bind(postId)
    .all();
  return c.json({ comments: results });
});

// POST /api/posts/:postId/comments - 댓글 작성 (로그인 필요)
comments.post("/posts/:postId/comments", requireAuth, async (c) => {
  const postId = parseId(c.req.param("postId"));
  if (postId === null) {
    return c.json({ message: "잘못된 게시글 번호입니다." }, 400);
  }
  const post = await c.env.DB.prepare("SELECT 1 FROM posts WHERE id = ?").bind(postId).first();
  if (!post) {
    return c.json({ message: "게시글을 찾을 수 없습니다." }, 404);
  }

  const input = await parseContent(c);
  if ("error" in input) return c.json({ message: input.error }, 400);

  const created = await c.env.DB.prepare(
    "INSERT INTO comments (post_id, author_id, content) VALUES (?, ?, ?) RETURNING id"
  )
    .bind(postId, c.get("userId"), input.content)
    .first<{ id: number }>();
  const comment = await c.env.DB.prepare(`${COMMENT_SELECT} WHERE c.id = ?`).bind(created!.id).first();
  return c.json({ comment }, 201);
});

// PUT /api/comments/:id - 댓글 수정 (본인 댓글만)
comments.put("/comments/:id", requireAuth, async (c) => {
  const id = parseId(c.req.param("id"));
  const denied = await checkOwner(c, id);
  if (denied) return denied;

  const input = await parseContent(c);
  if ("error" in input) return c.json({ message: input.error }, 400);

  await c.env.DB.prepare("UPDATE comments SET content = ? WHERE id = ?").bind(input.content, id).run();
  const comment = await c.env.DB.prepare(`${COMMENT_SELECT} WHERE c.id = ?`).bind(id).first();
  return c.json({ comment });
});

// DELETE /api/comments/:id - 댓글 삭제 (본인 댓글만)
comments.delete("/comments/:id", requireAuth, async (c) => {
  const id = parseId(c.req.param("id"));
  const denied = await checkOwner(c, id);
  if (denied) return denied;

  await c.env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
  return c.json({ ok: true });
});
