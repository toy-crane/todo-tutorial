# Todo Tutorial

[Claude Code Playbook](https://docs.claude-hunt.com) 강의의 실습용 저장소입니다. Next.js 와 shadcn/ui 로 시작하는 작은 Todo 앱을 단계별로 발전시키며 Claude Code 사용법을 익힙니다.

## 관련 링크

- 강의 본문: https://docs.claude-hunt.com
- 수강생 결과물 공유: https://claude-hunt.com

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- shadcn/ui (radix-maia 스타일, taupe 베이스)
- TypeScript / ESLint / Prettier
- 패키지 매니저: bun (1.3.x)

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

```
app/         # App Router 엔트리 (layout, page, 전역 스타일)
components/  # 재사용 컴포넌트 (components/ui 는 shadcn/ui 컴포넌트)
hooks/       # 커스텀 React 훅
lib/         # 유틸리티 함수 (cn 등)
public/      # 정적 파일
```

현재 저장소는 강의 시작 시점의 초기 스캐폴드 상태이며, `main` 브랜치 하나만 제공합니다. 레슨이 진행되면서 각 챕터의 시작 코드가 별도 브랜치로 추가될 예정입니다. 레슨 본문에서 브랜치를 안내하면 아래와 같이 전환한 뒤 따라가시면 됩니다.

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
import { Button } from "@/components/ui/button";
```
