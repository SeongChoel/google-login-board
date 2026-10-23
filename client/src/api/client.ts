// 서버가 { message }로 내려준 오류 문구를 그대로 던진다.
export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message ?? `요청 실패 (${res.status})`);
  }
  return body as T;
}

function sendJson<T>(method: string, url: string, data?: unknown): Promise<T> {
  return request<T>(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
}

export const postJson = <T>(url: string, data: unknown) => sendJson<T>("POST", url, data);
export const putJson = <T>(url: string, data: unknown) => sendJson<T>("PUT", url, data);
export const deleteJson = <T>(url: string) => sendJson<T>("DELETE", url);
