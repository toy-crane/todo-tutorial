# Todo App

## Tech Stack
- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui
- 상태 저장: localStorage (서버 저장 없음)
- 테스트: Vitest + Testing Library (jsdom)

## Architecture
- Server Components 우선, 클라이언트 상태는 최소화
- 디렉토리: `app/` (라우트), `components/` (UI, `ui/`는 shadcn), `hooks/` (예: `use-todos.ts`), `lib/` (도메인 로직: category, filter, priority, sort)
- 요구사항 정의: `todo-requirements.md`

## Workflow
- 패키지 매니저: bun
- 주요 스크립트: `bun dev`, `bun run build`, `bun run lint`, `bun run typecheck`, `bun test`
- 커밋 메시지: Conventional Commits (feat:, fix:, refactor:, chore:)
- shadcn 컴포넌트 추가: `bunx --bun shadcn@latest add <name>`

## Plan Mode
- 계획 끝에 미해결 질문을 포함하세요

## Rules
- 모든 대화에서 한글만 사용
