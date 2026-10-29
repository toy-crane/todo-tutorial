# Todo Tutorial

[Claude Code Playbook](https://docs.claude-hunt.com) 강의의 실습용 저장소입니다. Next.js 와 shadcn/ui 로 시작하는 작은 Todo 앱을 단계별로 발전시키며 Claude Code 사용법을 익힙니다.

## 관련 링크

- 강의 본문: https://docs.claude-hunt.com
- 수강생 결과물 공유: https://claude-hunt.com

## 주요 기능

- Todo 추가, 수정, 삭제, 완료 처리
- 우선순위(높음 / 보통 / 낮음)와 마감일 지정
- 카테고리 태그(업무 / 개인 / 쇼핑)
- 제목 검색, 상태 필터(전체 / 진행중 / 완료), 카테고리 필터
- 정렬(생성일순 / 이름순 / 마감일순)
- 브라우저 `localStorage` 저장 (서버나 DB 없이 동작)
- 다크 모드 지원

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- shadcn/ui (radix-maia 스타일, taupe 베이스)
- TypeScript / ESLint / Prettier
- 테스트: Vitest, React Testing Library
- 패키지 매니저: bun

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
bun run test       # 테스트 1회 실행 (Vitest)
bun run test:watch # 테스트 watch 모드
```

## 프로젝트 구조

```
app/          # App Router 페이지와 레이아웃
components/   # Todo UI 컴포넌트 (테스트 파일 함께 위치)
components/ui # shadcn/ui 컴포넌트
hooks/        # use-todos 등 커스텀 훅
lib/          # 타입, 유틸 함수 (todo-utils, types, utils)
```

Server Components 를 우선하고, 클라이언트 상태는 최소한으로 유지합니다. 작업 규칙은 [CLAUDE.md](./CLAUDE.md) 에 정리되어 있습니다.

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

## Contributors

- 토이크레인 - Frontend Developer
