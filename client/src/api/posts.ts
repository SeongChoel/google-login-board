import type { Post } from "../types";
import { request } from "./client";

export async function fetchPosts(): Promise<Post[]> {
  const { posts } = await request<{ posts: Post[] }>("/api/posts");
  return posts;
}

export async function fetchPost(id: number): Promise<Post> {
  const { post } = await request<{ post: Post }>(`/api/posts/${id}`);
  return post;
}
