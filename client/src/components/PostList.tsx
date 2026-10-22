import type { Post } from "../types";
import PostListItem from "./PostListItem";

// TODO: 실제로는 props가 아니라 API 응답으로 목록을 받아오도록 구현하세요.
const DUMMY_POSTS: Post[] = [
  { id: 1, title: "첫 번째 게시글입니다", author: "관리자", createdAt: "2026-07-18", content: "" },
  { id: 2, title: "두 번째 게시글입니다", author: "학생1", createdAt: "2026-07-19", content: "" },
  { id: 3, title: "세 번째 게시글입니다", author: "학생2", createdAt: "2026-07-20", content: "" },
];

export default function PostList() {
  return (
    <ul className="flex flex-col gap-2">
      {DUMMY_POSTS.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </ul>
  );
}
