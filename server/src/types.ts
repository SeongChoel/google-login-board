export interface Bindings {
  DB: D1Database; // 회원·게시글·댓글 DB (wrangler.toml의 d1_databases)
  JWT_SECRET: string; // 로그인 JWT 서명 키 (로컬: .dev.vars, 배포: wrangler secret put JWT_SECRET)
  BUCKET?: R2Bucket; // 이미지 업로드용 R2 버킷 (wrangler.toml에서 바인딩 필요)
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}
