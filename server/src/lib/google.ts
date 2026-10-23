// 구글 OAuth 2.0 인가 코드 흐름에 필요한 요청들
// 참고: https://developers.google.com/identity/protocols/oauth2/web-server

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GoogleUser {
  sub: string; // 구글 계정 고유 id
  email: string;
  email_verified: boolean;
  name?: string;
}

// 1단계: 사용자를 보낼 구글 로그인 페이지 주소
export function buildAuthUrl(config: GoogleConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account", // 여러 구글 계정 중 고를 수 있게
  });
  return `${AUTH_URL}?${params}`;
}

// 2단계: 콜백으로 받은 인가 코드를 액세스 토큰으로 교환
export async function exchangeCode(config: GoogleConfig, code: string): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    throw new Error(`구글 토큰 교환 실패 (${res.status}): ${await res.text()}`);
  }
  const { access_token } = await res.json<{ access_token: string }>();
  return access_token;
}

// 3단계: 액세스 토큰으로 사용자 정보 조회
export async function fetchGoogleUser(accessToken: string): Promise<GoogleUser> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`구글 사용자 정보 조회 실패 (${res.status}): ${await res.text()}`);
  }
  return res.json<GoogleUser>();
}
