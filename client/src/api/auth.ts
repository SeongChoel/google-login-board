import type { User } from "../types";
import { postJson, request } from "./client";

export interface SignupInput {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function signup(input: SignupInput): Promise<User> {
  const { user } = await postJson<{ user: User }>("/api/auth/signup", input);
  return user;
}

export async function login(input: LoginInput): Promise<User> {
  const { user } = await postJson<{ user: User }>("/api/auth/login", input);
  return user;
}

export async function logout(): Promise<void> {
  await postJson("/api/auth/logout", {});
}

// 로그인 쿠키로 현재 사용자를 확인한다. 비로그인이면 null.
export async function fetchMe(): Promise<User | null> {
  const { user } = await request<{ user: User | null }>("/api/auth/me");
  return user;
}
