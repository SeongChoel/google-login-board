import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Bindings } from "./types";
import { posts } from "./routes/posts";
import { comments } from "./routes/comments";
import { auth } from "./routes/auth";
import { uploads } from "./routes/uploads";

const app = new Hono<{ Bindings: Bindings }>();

// 개발 중에는 Vite 개발 서버(5173)에서 오는 요청을 허용합니다.
app.use("/api/*", cors());

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.route("/api/posts", posts);
app.route("/api/posts", comments);
app.route("/api/auth", auth);
app.route("/api/uploads", uploads);

export default app;
