import type { Comment } from "../types";
import { deleteJson, postJson, putJson, request } from "./client";

export async function fetchComments(postId: number): Promise<Comment[]> {
  const { comments } = await request<{ comments: Comment[] }>(`/api/posts/${postId}/comments`);
  return comments;
}

export async function createComment(postId: number, content: string): Promise<Comment> {
  const { comment } = await postJson<{ comment: Comment }>(`/api/posts/${postId}/comments`, { content });
  return comment;
}

export async function updateComment(id: number, content: string): Promise<Comment> {
  const { comment } = await putJson<{ comment: Comment }>(`/api/comments/${id}`, { content });
  return comment;
}

export async function deleteComment(id: number): Promise<void> {
  await deleteJson(`/api/comments/${id}`);
}
