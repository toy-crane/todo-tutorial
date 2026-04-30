# Todo Tutorial

[Claude Code Playbook](https://docs.claude-hunt.com) 강의의 실습용 저장소입니다. Next.js 와 shadcn/ui 로 시작하는 작은 Todo 앱을 단계별로 발전시키며 Claude Code 사용법을 익힙니다.

## 관련 링크

- 강의 본문: https://docs.claude-hunt.com
- 수강생 결과물 공유: https://claude-hunt.com

## 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, shadcn/ui, Tailwind CSS v4
- **Language**: TypeScript
- **Package Manager**: Bun

## 개발 환경 시작

```bash
bun install
bun dev
```

## 챕터별 시작 브랜치

각 레슨은 시작 시점의 코드 상태를 브랜치로 제공합니다. 레슨 본문에서 안내하는 브랜치로 전환한 뒤 따라가시면 됩니다.

```shell
git checkout ch02-03
```

| 브랜치 | 설명 |
|--------|------|
| `ch02-03` | Chapter 02-03 시작 상태 |
| `ch04-03` | Chapter 04-03 시작 상태 |
| `ch05-02` | Chapter 05-02 시작 상태 |
| `ch05-03` | Chapter 05-03 시작 상태 |
| `ch05-04` | Chapter 05-04 시작 상태 |
| `ch06-04` | Chapter 06-04 시작 상태 |
| `ch06-05` | Chapter 06-05 시작 상태 |
| `ch08-01` | Chapter 08-01 시작 상태 |
| `ch10-02` | Chapter 10-02 시작 상태 |

## GitHub Actions

이 저장소에는 Claude Code 를 활용한 GitHub Actions 워크플로우가 포함돼 있습니다.

### Claude PR Assistant (`claude.yml`)

이슈나 PR 에서 `@claude` 를 멘션하면 Claude 가 자동으로 작업을 수행합니다.

- 이슈·PR 댓글, PR 리뷰 댓글에서 `@claude` 멘션 시 동작
- 코드 수정, 질문 답변, PR 설명 작성 등 다양한 작업 요청 가능

### Claude Code Review (`claude-code-review.yml`)

PR 이 생성되거나 업데이트되면 Claude 가 자동으로 코드 리뷰를 수행합니다.

> 두 워크플로우 모두 `CLAUDE_CODE_OAUTH_TOKEN` 시크릿이 저장소에 등록돼 있어야 동작합니다.

## 강의 Q&A 도우미

이 저장소에는 강의 Q&A 를 도와주는 plugin (`claude-code-playbook@toy-crane`) 이 미리 등록돼 있습니다 (`.claude/settings.json` 의 `enabledPlugins` 참조). 저장소를 clone 한 뒤 Claude Code 를 실행하면 plugin 의 marketplace 와 `qna` Skill 이 자동으로 활성화됩니다. 강의 내용이 헷갈릴 때 Claude Code 입력창에 한국어로 질문하면 강의 본문을 우선 참조해 답합니다.

plugin·marketplace 의 동작 원리는 Chapter 06 의 "기존 Skill 가져다 쓰기" 레슨에서 다룹니다.

## 컴포넌트 추가

shadcn/ui 컴포넌트는 다음과 같이 추가합니다.

```bash
npx shadcn@latest add button
```

`components` 디렉토리에 컴포넌트가 추가됩니다.

## 컴포넌트 사용

```tsx
import { Button } from "@/components/ui/button";
```
