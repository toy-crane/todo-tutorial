# Todo Tutorial

by toycrane

[Claude Code Playbook](https://docs.claude-hunt.com) 강의의 실습용 저장소입니다. Next.js 와 shadcn/ui 로 시작하는 작은 Todo 앱을 단계별로 발전시키며 Claude Code 사용법을 익힙니다.

## 관련 링크

- 강의 본문: https://docs.claude-hunt.com
- 수강생 결과물 공유: https://claude-hunt.com

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- shadcn/ui (radix-maia 스타일, taupe 베이스)
- next-themes (다크 모드) · lucide-react (아이콘)
- TypeScript / ESLint / Prettier
- 패키지 매니저: bun 1.3.6

## 시작하기

```bash
bun install
bun dev
```

개발 서버는 기본적으로 [http://localhost:3000](http://localhost:3000) 에서 열립니다.

자주 쓰는 스크립트:

```bash
bun run build      # 프로덕션 빌드
bun run start      # 빌드 결과 실행
bun run lint       # ESLint
bun run typecheck  # tsc --noEmit
bun run format     # Prettier 포맷팅
```

## 프로젝트 구조

```text
app/         # App Router 페이지, 레이아웃, 전역 스타일
components/  # 공용 컴포넌트 (components/ui 에 shadcn/ui 컴포넌트)
hooks/       # 커스텀 훅
lib/         # 유틸리티 (cn 등)
```

경로 별칭은 `@/`(프로젝트 루트) 기준입니다. 예: `@/components/ui/button`, `@/lib/utils`.

## 다크 모드

`next-themes` 로 라이트/다크 테마를 지원합니다. 기본값은 시스템 설정을 따르며, 입력 중이 아닐 때 <kbd>d</kbd> 키를 누르면 테마가 토글됩니다.

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
