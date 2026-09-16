# Todo Tutorial

[Claude Code Playbook](https://docs.claude-hunt.com) 강의의 실습용 저장소입니다. Next.js 와 shadcn/ui 로 시작하는 작은 Todo 앱을 단계별로 발전시키며 Claude Code 사용법을 익힙니다.

## 관련 링크

- 강의 본문: https://docs.claude-hunt.com
- 수강생 결과물 공유: https://claude-hunt.com

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- shadcn/ui (radix-mira 스타일, taupe 베이스, Phosphor 아이콘, `@magicui` 레지스트리)
- next-themes (다크 모드)
- Vitest + Testing Library (jsdom)
- TypeScript / ESLint / Prettier
- 패키지 매니저: bun

## 주요 기능

- 할 일 추가 · 완료 토글 · 인라인 편집(편집 버튼 또는 더블클릭) · 삭제
- 우선순위(높음 / 보통 / 낮음), 마감일, 카테고리(업무 / 개인 / 쇼핑) 지정
- 제목 검색, 상태 필터(전체 / 진행중 / 완료), 카테고리 필터
- 정렬(생성일순 / 이름순 / 마감일순)
- `localStorage` 기반 저장 — 새로고침해도 목록이 유지됩니다
- 다크 모드 — 입력 중이 아닐 때 <kbd>d</kbd> 키로 전환

## 시작하기

```bash
bun install
bun dev
```

개발 서버는 기본적으로 [http://localhost:3000](http://localhost:3000) 에서 열립니다.

자주 쓰는 스크립트:

```bash
bun dev            # 개발 서버 실행
bun run build      # 프로덕션 빌드
bun run start      # 빌드 결과 실행
bun run lint       # ESLint
bun run typecheck  # tsc --noEmit
bun run format     # Prettier 포맷팅
bun run test       # Vitest 1회 실행
bun run test:watch # Vitest watch 모드
```

## 프로젝트 구조

```text
app/            # App Router 진입점 (layout, page, globals.css)
components/     # Todo 기능 컴포넌트 + 테스트
components/ui/  # shadcn/ui 컴포넌트 (직접 수정하지 않음)
hooks/          # use-todos 등 클라이언트 훅
lib/            # 타입 정의(types.ts), 정렬·검색 유틸(todo-utils.ts)
.claude/        # Claude Code 설정 (skills, agents, hooks, rules)
```

테스트는 소스 파일 옆에 `*.test.ts(x)` 로 함께 둡니다.

## 챕터별 시작 브랜치

각 레슨은 시작 시점의 코드 상태를 브랜치로 제공합니다. 레슨 본문에서 안내하는 브랜치로 전환한 뒤 따라가시면 됩니다.

```shell
git checkout ch02-02
```

## 컴포넌트 추가

shadcn/ui 컴포넌트는 다음과 같이 추가합니다.

```bash
bunx --bun shadcn@latest add button
```

`components/ui` 디렉토리에 컴포넌트가 추가됩니다.

## 컴포넌트 사용

```tsx
import { Button } from "@/components/ui/button";
```

## Claude Code 설정

저장소에는 강의에서 다루는 Claude Code 설정이 함께 들어 있습니다.

- `CLAUDE.md` — 아키텍처 원칙, 커밋 규칙(Conventional Commits) 등 프로젝트 공통 지침
- `.claude/skills/` — `commit`(Conventional Commit 커밋), `shadcn`(컴포넌트 작업), `ui-bug-report`(UI 버그 리포트 작성)
- `.claude/agents/test-planner.md` — 소스와 테스트를 대조해 부족한 테스트를 찾아주는 서브에이전트
- `.claude/hooks/lint.sh` — 파일을 수정할 때마다 ESLint `--fix` 를 실행하는 PostToolUse 훅
- `.claude/rules/shadcn.md` — `components/ui/**` 작업 시 적용되는 규칙
- `.github/workflows/` — 이슈·PR에서 `@claude` 멘션에 응답하고, PR 자동 리뷰를 수행하는 GitHub Actions

## Contributors

- 토이크레인 - Frontend Developer
