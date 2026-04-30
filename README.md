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
- 패키지 매니저: bun

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

## 챕터별 시작 브랜치

각 레슨은 시작 시점의 코드 상태를 브랜치로 제공합니다. 레슨 본문에서 안내하는 브랜치로 전환한 뒤 따라가시면 됩니다.

```shell
git checkout ch02-03
```

## GitHub Actions 워크플로우

이 저장소에는 두 가지 Claude Code GitHub Actions 워크플로우가 포함돼 있습니다.

### Claude Code Review (`claude-code-review.yml`)

PR이 열리거나 업데이트될 때 자동으로 코드 리뷰를 수행합니다. `CLAUDE_CODE_OAUTH_TOKEN` 시크릿을 GitHub 저장소에 등록해야 동작합니다.

### Claude PR Assistant (`claude.yml`)

이슈·PR 코멘트·리뷰에서 `@claude` 를 멘션하면 Claude Code가 지시 사항을 수행합니다. 코드 수정, PR 설명 업데이트 등 다양한 작업을 자연어로 요청할 수 있습니다.

워크플로우 동작 원리는 Chapter 07 의 "GitHub Actions 연동" 레슨에서 다룹니다.

## 강의 Q&A 도우미

이 저장소에는 강의 Q&A 를 도와주는 plugin (`claude-code-playbook@toy-crane`) 이 미리 등록돼 있습니다 (`.claude/settings.json` 의 `enabledPlugins` 참조). 저장소를 clone 한 뒤 Claude Code 를 실행하면 plugin 의 marketplace 와 `qna` Skill 이 자동으로 활성화됩니다. 강의 내용이 헷갈릴 때 Claude Code 입력창에 한국어로 질문하면 강의 본문을 우선 참조해 답합니다.

plugin·marketplace 의 동작 원리는 Chapter 06 의 "기존 Skill 가져다 쓰기" 레슨에서 다룹니다.

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
