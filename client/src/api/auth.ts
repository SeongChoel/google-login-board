import type { User } from "../types";
import { postJson } from "./client";

export interface SignupInput {
  email: string;
  password: string;
  nickname: string;
}

export async function signup(input: SignupInput): Promise<User> {
  const { user } = await postJson<{ user: User }>("/api/auth/signup", input);
  return user;
}
