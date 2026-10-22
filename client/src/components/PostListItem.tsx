import { Link } from "react-router-dom";
import type { Post } from "../types";

interface Props {
  post: Post;
}

export default function PostListItem({ post }: Props) {
  return (
    <li>
      <Link
        to={`/board/${post.id}`}
        className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <span className="font-medium text-slate-900">{post.title}</span>
        <span className="whitespace-nowrap text-sm text-slate-500">
          {post.author} · {post.createdAt}
        </span>
      </Link>
    </li>
  );
}
