import type { Post } from "../types";
import PostListItem from "./PostListItem";

interface Props {
  posts: Post[];
}

export default function PostList({ posts }: Props) {
  if (posts.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">아직 게시글이 없습니다.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </ul>
  );
}
