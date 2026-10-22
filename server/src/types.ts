// TODO: D1을 바인딩하면 DB: D1Database 타입을 추가하세요.
export interface Bindings {
  BUCKET?: R2Bucket; // 이미지 업로드용 R2 버킷 (wrangler.toml에서 바인딩 필요)
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}
