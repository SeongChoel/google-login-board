// 실습 중 서버 연동 시 이 타입들을 실제 API 응답 형태에 맞게 수정하세요.

export interface Post {
  id: number;
  title: string;
  author: string; // 작성자 닉네임
  authorId: number;
  createdAt: string; // ISO 문자열 (UTC)
  content: string;
  imageUrl: string | null;
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
}
