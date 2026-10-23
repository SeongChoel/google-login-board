export interface Bindings {
  DB: D1Database; // 회원·게시글·댓글 DB (wrangler.toml의 d1_databases)
  JWT_SECRET: string; // 로그인 JWT 서명 키 (로컬: .dev.vars, 배포: wrangler secret put JWT_SECRET)
  BUCKET?: R2Bucket; // 이미지 업로드용 R2 버킷 (wrangler.toml에서 바인딩 필요)
  // 구글 OAuth (로컬: .dev.vars, 배포: wrangler secret put)
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string; // Google Cloud Console에 등록한 승인된 리디렉션 URI와 똑같아야 함
}
