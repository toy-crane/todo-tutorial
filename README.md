# Todo Tutorial

[Claude Code Playbook](https://docs.claude-hunt.com) 강의의 실습용 저장소입니다. Next.js 와 shadcn/ui 로 시작하는 작은 Todo 앱을 단계별로 발전시키며 Claude Code 사용법을 익힙니다.

## 프로젝트 소개

브라우저에서 바로 쓰는 개인용 할 일 관리 앱입니다. 별도의 서버나 데이터베이스 없이 동작하며, 할 일 목록은 브라우저의 `localStorage` 에 저장되어 새로고침해도 유지됩니다.

### 주요 기능

- **할 일 관리**: 할 일을 추가하고, 완료 체크하고, 삭제합니다. 항목을 더블클릭하면 제목을 바로 편집할 수 있습니다.
- **우선순위**: 높음 / 보통 / 낮음 중 하나를 지정하면 목록에 뱃지로 표시됩니다.
- **마감일과 카테고리**: 마감일(날짜)과 카테고리(업무 / 개인 / 쇼핑)를 선택적으로 붙일 수 있습니다.
- **필터와 정렬**: 진행 상태(전체 / 진행중 / 완료)와 카테고리로 목록을 걸러내고, 생성일순 / 이름순 / 마감일순으로 정렬합니다.
- **검색**: 제목에 포함된 검색어로 목록을 좁힙니다.
- **다크 모드**: 입력창 밖에서 `d` 키를 누르면 라이트 / 다크 테마가 전환됩니다.

### 디렉토리 구조

```
├── app/             Next.js App Router 진입점 (layout, page, 전역 스타일)
├── components/      Todo UI 컴포넌트와 컴포넌트 테스트
│   └── ui/          shadcn/ui 로 추가한 기본 컴포넌트 (직접 수정하지 않음)
├── hooks/           use-todos — 할 일 상태와 localStorage 동기화
├── lib/             타입 정의, 정렬·검색 유틸리티
├── CLAUDE.md        Claude Code 가 참고하는 프로젝트 지침
└── .claude/         Claude Code 설정 (rules, hooks, skills, agents)
```

## 관련 링크

- 강의 본문: https://docs.claude-hunt.com
- 수강생 결과물 공유: https://claude-hunt.com

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- shadcn/ui (radix-maia 스타일, taupe 베이스)
- Vitest + Testing Library (jsdom)
- TypeScript / ESLint / Prettier
- 패키지 매니저: bun

## 실행 방법

### 사전 준비

- [bun](https://bun.sh) 1.3.6 이상

### 설치와 개발 서버 실행

```bash
git clone https://github.com/toy-crane/todo-tutorial.git
cd todo-tutorial
bun install
bun dev
```

개발 서버는 기본적으로 [http://localhost:3000](http://localhost:3000) 에서 열립니다.

### 프로덕션 빌드

```bash
bun run build   # .next/ 에 프로덕션 빌드 생성
bun run start   # 빌드 결과를 실행
```

### 테스트와 코드 검사

| 명령                 | 설명                                    |
| -------------------- | --------------------------------------- |
| `bun run test`       | Vitest 로 전체 테스트를 한 번 실행      |
| `bun run test:watch` | 파일 변경을 감지하며 테스트 실행        |
| `bun run lint`       | ESLint 검사                             |
| `bun run typecheck`  | TypeScript 타입 검사 (`tsc --noEmit`)   |
| `bun run format`     | Prettier 로 `ts` / `tsx` 파일 포맷팅    |

> `bun test` 는 Bun 내장 테스트 러너를 실행하므로 이 프로젝트의 Vitest 설정이 적용되지 않습니다. 테스트는 `bun run test` 로 실행하세요.

## 챕터별 시작 브랜치

각 레슨은 시작 시점의 코드 상태를 브랜치로 제공합니다. 레슨 본문에서 안내하는 브랜치로 전환한 뒤 따라가시면 됩니다.

```bash
git checkout ch02-03
```

## shadcn/ui 컴포넌트

컴포넌트는 다음과 같이 추가합니다. `components/ui` 디렉토리에 파일이 생성됩니다.

```bash
bunx --bun shadcn@latest add button
```

추가한 컴포넌트는 `@/components/ui` 경로에서 가져와 사용합니다.

```tsx
import { Button } from "@/components/ui/button";
```

`components/ui` 아래 파일은 직접 수정하지 않고, 스타일이나 동작을 바꾸려면 래퍼 컴포넌트를 만들어 사용합니다.

## Contributors

- 토이크레인 - Frontend Developer
