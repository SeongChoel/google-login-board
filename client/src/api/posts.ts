import type { Post } from "../types";
import { deleteJson, postJson, putJson, request } from "./client";

export interface PostInput {
  title: string;
  content: string;
}

export async function fetchPosts(): Promise<Post[]> {
  const { posts } = await request<{ posts: Post[] }>("/api/posts");
  return posts;
}

export async function fetchPost(id: number): Promise<Post> {
  const { post } = await request<{ post: Post }>(`/api/posts/${id}`);
  return post;
}

export async function createPost(input: PostInput): Promise<Post> {
  const { post } = await postJson<{ post: Post }>("/api/posts", input);
  return post;
}

export async function updatePost(id: number, input: PostInput): Promise<Post> {
  const { post } = await putJson<{ post: Post }>(`/api/posts/${id}`, input);
  return post;
}

export async function deletePost(id: number): Promise<void> {
  await deleteJson(`/api/posts/${id}`);
}
