import type { Post } from "../types";

// 서버가 { message }로 내려준 오류 문구를 그대로 던진다.
async function request<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message ?? `요청 실패 (${res.status})`);
  }
  return body as T;
}

export async function fetchPosts(): Promise<Post[]> {
  const { posts } = await request<{ posts: Post[] }>("/api/posts");
  return posts;
}

export async function fetchPost(id: number): Promise<Post> {
  const { post } = await request<{ post: Post }>(`/api/posts/${id}`);
  return post;
}
