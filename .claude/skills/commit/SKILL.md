---
name: commit
description: Stage changes and create Conventional Commit messages in English with scopes. Automatically splits unrelated changes into separate logical commits. Use whenever the user requests committing changes — including phrases like "커밋", "커밋해줘", "변경사항 저장", "변경사항 커밋", "commit", "save changes", "commit changes". Also use this skill when other workflows (push, merge, PR creation) need to commit uncommitted changes before proceeding.
---

# Commit

현재 작업 디렉토리의 변경사항을 분석해서 Conventional Commits 스펙에 맞는 영어 커밋 메시지로 나누어 커밋합니다.

## 핵심 원칙

1. **One logical change per commit** — 커밋 메시지에 "and"를 써야 한다면 둘로 쪼갭니다. 서로 다른 의도(기능 + 버그수정, 리팩토링 + 문서)는 항상 분리합니다.
2. **영어 메시지** — type, scope, subject 모두 영어로 작성합니다 (사용자 선호).
3. **Scope 포함** — `type(scope): subject` 형태가 기본. scope가 모호하면 생략 가능.
4. **Push 금지** — 사용자가 명시적으로 push를 요청하지 않는 한 커밋만 합니다.

## Workflow

### 1단계: 현재 상태 파악

병렬로 실행:
- `git status` — `-uall` 플래그는 큰 저장소에서 메모리 문제가 생길 수 있으므로 사용하지 않습니다.
- `git diff` — staged + unstaged 모두 확인.
- `git log -5 --oneline` — 저장소의 메시지 톤/스타일 참고.

### 2단계: 변경사항을 논리 단위로 그룹화

각 변경(파일 또는 hunk)을 다음 기준으로 묶습니다:

- **Type**: feat / fix / refactor / docs / test / chore / style / perf / build / ci
- **Scope**: 영향 받는 모듈 (예: `auth`, `api`, `ui`, `db`, `todo`). 명확한 단일 모듈이 없으면 생략.
- **Intent**: 같은 사용자 의도를 달성하는 변경끼리 묶기.

서로 다른 그룹은 별도 커밋으로 분리합니다.

**같은 커밋으로 묶는 예:**
- 기능 코드 + 그 기능의 테스트 (`src/auth/jwt.ts` + `tests/auth/jwt.test.ts`)
- 리팩토링 대상 + 그 영향으로 호출부 수정

**별도 커밋으로 분리하는 예:**
- 새 기능 추가 + 무관한 버그 수정
- 코드 변경 + 무관한 문서 오타 수정
- 두 개의 다른 모듈을 건드리는 별개 작업

### 3단계: Plan 보여주고 확인

여러 커밋으로 나뉜다면, 진행 전에 한국어로 plan을 제시하고 확인 받습니다:

```
다음 순서로 커밋할게요:
1. feat(auth): add JWT validation — src/auth/jwt.ts, tests/auth/jwt.test.ts
2. fix(api): handle null response in /users — src/api/users.ts
3. docs: fix typo in README — README.md

진행할까요?
```

단일 커밋이면 plan 단계 생략 가능.

### 4단계: Staging 후 커밋

- 파일 단위로 묶이면 `git add <files>` 사용.
- 같은 파일에 서로 다른 논리 단위가 섞여 있으면 `git add -p`로 hunk 단위 staging.
- `git add -A` / `git add .` 사용 금지 — `.env`, credentials, 빌드 산출물 등이 의도치 않게 포함될 수 있습니다.
- `.env`, credentials, 키 파일 등 민감 파일이 변경 목록에 있으면 사용자에게 경고.
- 커밋 메시지는 항상 HEREDOC으로 전달:

```bash
git commit -m "$(cat <<'EOF'
feat(auth): add JWT validation
EOF
)"
```

### 5단계: 검증 및 요약

- 각 커밋 후 결과 확인.
- 모든 커밋 완료 후 `git log -N --oneline` (N = 만든 커밋 수)으로 요약 출력.

## Commit Message 규칙

### Type 의미

- **feat** — 완전히 새로운 기능
- **fix** — 버그 수정
- **refactor** — 동작 변경 없는 코드 정리
- **docs** — 문서 (README, JSDoc, 주석)
- **test** — 테스트 추가/수정만
- **chore** — 빌드, 설정, 의존성, lockfile, 잡일
- **style** — 포매팅 (코드 동작에 영향 없음)
- **perf** — 성능 개선
- **build** — 빌드 시스템
- **ci** — CI 설정

"add"는 새로운 기능에, "update"는 기존 기능 개선에, "fix"는 버그 수정에만 씁니다. 의미를 정확히 맞추는 것이 중요합니다.

### Subject 형식

- 영어 명령형 (`add`, `fix`, `remove` — `added`, `fixes`, `adding` 아님)
- 첫 글자 소문자
- 끝에 마침표 없음
- 50자 이내 권장
- "무엇을" 간결하게. "왜"는 본문(필요할 때만).

### 예시

| 변경 내용 | 커밋 메시지 |
|-----------|-------------|
| 로그인 폼에 이메일 검증 추가 | `feat(auth): add email validation to login form` |
| 카테고리 필터 null 처리 버그 수정 | `fix(filter): handle null category in filter logic` |
| TodoItem 컴포넌트 분리 | `refactor(todo): extract TodoItem into separate component` |
| README 설치 가이드 추가 | `docs: add installation guide to README` |
| bun lockfile 업데이트 | `chore: update bun lockfile` |
| useDebounce 훅 테스트 추가 | `test(hooks): add tests for useDebounce` |

## 절대 하지 않을 것

- `--no-verify` (pre-commit hook 우회) — 사용자가 명시적으로 요청한 경우에만.
- `git commit --amend` — 새 커밋을 만드는 게 기본. amend는 사용자가 명시적으로 요청할 때만.
- `git push` — 사용자가 명시적으로 요청한 경우에만.
- `git add -A` / `git add .` — 의도치 않은 파일 포함 위험.
- 자동 서명/푸터 추가 — 사용자가 따로 지시하지 않은 한 메시지에 Co-Authored-By 등을 추가하지 않습니다.

## 변경사항이 없을 때

`git status`가 깨끗하면 새 커밋을 만들지 말고 사용자에게 알립니다: "변경사항이 없어서 커밋할 게 없어요."
