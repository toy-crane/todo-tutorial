# Todo Tutorial

[Claude Code Playbook](https://docs.claude-hunt.com) 강의의 실습용 저장소입니다. Next.js 와 shadcn/ui 로 시작하는 작은 Todo 앱을 단계별로 발전시키며 Claude Code 사용법을 익힙니다.

할 일을 추가·수정·삭제하고 검색, 필터, 정렬로 정리하는 단일 페이지 앱입니다. 데이터는 서버 없이 브라우저 `localStorage` 에 저장되므로 별도의 환경 변수나 백엔드 설정 없이 바로 실행할 수 있습니다.

## 주요 기능

- 할 일 추가 / 완료 토글 / 인라인 편집 / 삭제 (빈 내용으로 저장하면 삭제 처리)
- 우선순위(높음·보통·낮음), 마감일, 카테고리(업무·개인·쇼핑) 지정
- 제목 검색, 상태 필터(전체·진행중·완료), 카테고리 필터
- 정렬(생성일순·이름순·마감일순, 마감일 없는 항목은 뒤로)
- `localStorage` 자동 저장 및 복원 (과거 형식 데이터는 기본값으로 보정)
- 시스템 설정을 따르는 다크 모드 — 입력 중이 아닐 때 `D` 키로 전환

## 관련 링크

- 강의 본문: https://docs.claude-hunt.com
- 수강생 결과물 공유: https://claude-hunt.com

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- shadcn/ui (radix-maia 스타일, taupe 베이스)
- TypeScript / ESLint / Prettier
- Vitest + Testing Library
- 패키지 매니저: bun 1.3.6

## 시작하기

사전 준비: [bun](https://bun.sh) 1.3.6 이상.

```bash
bun install
bun dev
```

개발 서버는 기본적으로 [http://localhost:3000](http://localhost:3000) 에서 열립니다. 환경 변수 설정은 필요하지 않습니다.

프로덕션 빌드를 확인하려면:

```bash
bun run build
bun run start
```

자주 쓰는 스크립트:

```bash
bun dev             # 개발 서버 실행
bun run build       # 프로덕션 빌드
bun run start       # 빌드 결과 실행
bun run lint        # ESLint
bun run typecheck   # tsc --noEmit
bun run format      # Prettier 포맷팅
bun run test        # Vitest 1회 실행
bun run test:watch  # Vitest watch 모드
```

## 프로젝트 구조

```text
app/            레이아웃과 페이지 (App Router)
components/     Todo 기능 컴포넌트와 테스트
components/ui/  shadcn/ui 컴포넌트
hooks/          use-todos (localStorage 연동 상태)
lib/            타입 정의와 정렬·검색 유틸
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
import { Button } from "@/components/ui/button";
```

## Contributors

- 토이크레인 - Frontend Developer
