import { Hono } from "hono";
import type { Bindings } from "../types";

export const uploads = new Hono<{ Bindings: Bindings }>();

// POST /api/uploads - 이미지를 R2에 업로드하고 접근 가능한 URL을 반환
// TODO: 로그인한 사용자만 업로드 가능하도록 인증을 확인하세요.
// TODO: multipart/form-data로 받은 파일을 c.env.BUCKET.put(key, file)로 저장하고,
//       공개 URL(R2 공개 버킷 도메인 또는 자체 서빙 라우트)을 반환하세요.
uploads.post("/", (c) => {
  return c.json({ message: "TODO: 이미지 업로드(R2) 구현" }, 501);
});
