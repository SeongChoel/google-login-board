---
name: git-push
description: git status와 git diff로 변경사항을 확인하고, 변경 내용을 요약한 커밋 메시지로 커밋한 뒤 GitHub(origin)에 push한다.
disable-model-invocation: true
---

# 변경사항 커밋 & 푸시

## 절차

### 1. 변경사항 확인

아래 명령을 병렬로 실행해 무엇이 바뀌었는지 파악한다.

```bash
git status
git diff
git diff --staged
git log --oneline -5
```

- 변경사항이 하나도 없으면 "커밋할 변경사항이 없습니다"라고 알리고 멈춘다.
- 새로 추가된(untracked) 파일은 내용을 열어 보고 커밋해도 되는 파일인지 확인한다.

### 2. 커밋하면 안 되는 파일 제외

다음 파일은 스테이징하지 않는다. 섞여 있으면 사용자에게 알린다.

- 비밀값이 든 파일: `.env`, `.dev.vars`, `*.local`, 인증서·키 파일
- 빌드/의존성 산출물: `node_modules/`, `dist/`, `.wrangler/`
- 코드 안에 하드코딩된 Google OAuth client secret(`GOCSPX-…`), API 키, 토큰

`git add -A`를 쓰지 말고, 확인한 파일만 경로를 지정해서 스테이징한다.

```bash
git add <파일1> <파일2> ...
```

### 3. 커밋 메시지 작성 & 커밋

- `git log`에 보이는 기존 메시지 스타일을 따르고, 한국어로 쓴다.
- 첫 줄은 무엇을 왜 바꿨는지 50자 안팎으로 요약한다. 예: `게시글 상세 페이지에 댓글 목록 추가`
- 변경이 여러 갈래면 빈 줄 다음에 `- ` 목록으로 주요 변경을 적는다.
- 여러 줄 메시지는 heredoc으로 넘긴다.

```bash
git commit -m "$(cat <<'EOF'
요약 한 줄

- 세부 변경 1
- 세부 변경 2
EOF
)"
```

커밋 훅이 실패하면 `--no-verify`로 건너뛰지 말고, 원인을 고친 뒤 새로 커밋한다.

### 4. 푸시

```bash
git push
```

- 현재 브랜치에 upstream이 없다는 오류가 나면 `git push -u origin <현재 브랜치>`로 푸시한다.
- 원격에 새 커밋이 있어서 push가 거부(rejected)되면 **절대 `--force`를 쓰지 않는다.** 상황을 알리고, `git pull --rebase` 후 다시 push할지 사용자에게 묻는다.

### 5. 결과 알려주기

커밋 해시, 커밋 메시지, push한 브랜치(예: `main -> origin/main`)를 짧게 알려준다.
