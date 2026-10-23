-- 로컬 개발용 테스트 데이터 (npm run db:seed:local)
-- 원격(Cloudflare) DB에는 넣지 않는다.

INSERT INTO users (id, email, nickname, provider) VALUES
  (1, 'admin@example.com',    '관리자', 'local'),
  (2, 'student1@example.com', '학생1',  'local'),
  (3, 'student2@example.com', '학생2',  'google');

INSERT INTO posts (id, title, content, author_id, created_at) VALUES
  (1, '첫 번째 게시글입니다', '게시판에 오신 것을 환영합니다.', 1, '2026-10-21 09:00:00'),
  (2, '두 번째 게시글입니다', '두 번째 글 본문입니다.',          2, '2026-10-22 10:30:00'),
  (3, '세 번째 게시글입니다', '여러 줄 본문 테스트' || char(10) || '둘째 줄', 3, '2026-10-23 01:15:00');

INSERT INTO comments (post_id, author_id, content) VALUES
  (1, 2, '댓글 예시입니다');
