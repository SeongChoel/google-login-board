---
name: dev-server
description: client(Vite, 5173)와 server(wrangler dev, 8787) 개발 서버를 백그라운드로 켜고, 둘 다 응답하는지 확인한 뒤 주소를 알려준다. "서버 켜줘", "개발 서버 실행", "dev 서버 띄워줘" 같은 요청에 사용.
---

# 개발 서버 실행

이 프로젝트는 두 개의 개발 서버로 동작한다.

| 서버 | 폴더 | 명령 | 주소 |
|------|------|------|------|
| client (Vite + React) | `client/` | `npm run dev` | http://localhost:5173 |
| server (Hono on wrangler dev) | `server/` | `npm run dev` | http://localhost:8787 |

client의 `/api` 요청은 Vite 프록시를 통해 server(8787)로 전달된다(`client/vite.config.ts`).

## 절차

### 1. 이미 켜져 있는지 확인

두 포트에 먼저 요청을 보내 본다. 응답 코드가 `000`이 아니면 이미 실행 중이므로 그 서버는 다시 켜지 않는다(중복 실행 시 Vite가 다른 포트로 밀려난다).

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
curl -s -o /dev/null -w "%{http_code}" http://localhost:8787
```

### 2. 의존성 설치 (처음 한 번)

`client/node_modules` 또는 `server/node_modules`가 없으면 해당 폴더에서 먼저 설치한다.

```bash
npm install --prefix client
npm install --prefix server
```

### 3. 백그라운드로 실행

꺼져 있는 서버만, Bash 도구의 `run_in_background: true`로 각각 따로 실행한다. 명령 끝에 `&`를 붙이지 않는다.

- client: `cd client && npm run dev -- --strictPort`
  - `--strictPort`는 5173이 사용 중일 때 다른 포트로 바꾸지 않고 바로 실패하게 한다.
- server: `cd server && npm run dev`

### 4. 켜졌는지 확인

`sleep`으로 기다리지 말고 curl의 재시도 옵션으로 서버가 뜰 때까지 기다린다.

```bash
curl -s -o /dev/null -w "client %{http_code}\n" --retry 15 --retry-delay 2 --retry-connrefused http://localhost:5173
curl -s -o /dev/null -w "server %{http_code}\n" --retry 15 --retry-delay 2 --retry-connrefused http://localhost:8787
```

HTTP 응답 코드가 나오면(404 포함) 서버는 켜진 것이다. server의 `/` 경로에 라우트가 없으면 404가 나올 수 있는데, 이것도 정상이다.

`000`이 나오면 실패다. 백그라운드 작업의 출력을 읽어서 원인(포트 충돌, 설치 누락, 타입 오류 등)을 찾아 사용자에게 알려준다.

### 5. 결과 알려주기

두 서버의 상태와 주소를 짧게 알려준다. 예:

- client: http://localhost:5173 (실행 중)
- server: http://localhost:8787 (실행 중)

브라우저에서는 client 주소로 접속하면 된다.
