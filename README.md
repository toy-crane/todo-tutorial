# Todo Tutorial

[Claude Code Playbook](https://docs.claude-hunt.com) 강의의 실습용 저장소입니다. Next.js 와 shadcn/ui 로 시작하는 작은 Todo 앱을 단계별로 발전시키며 Claude Code 사용법을 익힙니다.

현재 저장소는 shadcn/ui `Button` 컴포넌트와 다크 모드 토글이 포함된 시작 페이지 상태이며, 각 챕터 브랜치를 따라가며 Todo 기능을 하나씩 추가해 나갑니다.

## 관련 링크

- 강의 본문: https://docs.claude-hunt.com
- 수강생 결과물 공유: https://claude-hunt.com

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- shadcn/ui (radix-maia 스타일, taupe 베이스)
- TypeScript / ESLint / Prettier
- 패키지 매니저: bun 1.3.6

## 시작하기

### 사전 준비물

- [Bun](https://bun.sh) 1.3.6 이상 (`curl -fsSL https://bun.sh/install | bash` 로 설치)

### 설치 및 실행

```bash
git clone https://github.com/toy-crane/todo-tutorial.git
cd todo-tutorial
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

```
app/            # App Router 페이지, 레이아웃, 전역 스타일
components/     # 공용 React 컴포넌트 (components/ui 는 shadcn/ui 컴포넌트)
lib/            # 유틸리티 함수
hooks/          # 커스텀 React 훅
```

## 챕터별 시작 브랜치

각 레슨은 시작 시점의 코드 상태를 브랜치로 제공합니다. 레슨 본문에서 안내하는 브랜치로 전환한 뒤 따라가시면 됩니다.

```shell
git checkout ch02-03
```

## 컴포넌트 추가

shadcn/ui 컴포넌트는 다음과 같이 추가합니다.

```bash
bunx --bun shadcn@latest add button
```

`components/ui` 디렉토리에 컴포넌트가 추가됩니다.

## 컴포넌트 사용

```tsx
import { Button } from "@/components/ui/button"
```
