---
name: ui-bug-report
description: 열린 Chrome 탭의 콘솔 · 네트워크 · DOM 상태를 수집해 팀 버그 리포트 템플릿으로 정리한다. "버그 리포트 만들어줘", "이 페이지 이상한 것 좀 정리해줘" 같은 요청에 호출.
---

# UI Bug Report Skill

열려 있는 Chrome 탭을 조사해 아래 템플릿에 맞춰 버그 리포트를 작성한다.

## 수집 절차

1. `mcp__claude-in-chrome__tabs_context_mcp` — 대상 탭 확인
2. `mcp__claude-in-chrome__read_console_messages` — 콘솔 에러 수집
3. `mcp__claude-in-chrome__read_network_requests` — 4xx/5xx 응답 추출
4. `mcp__claude-in-chrome__read_page` — DOM 상태 및 가시 증상 확인
5. 필요 시 스크린샷 촬영

> chrome 도구는 호출 전 ToolSearch로 스키마를 먼저 로드해야 한다.

## 심각도 분류

- **critical** — 페이지 동작 불가, 5xx 에러
- **major** — 일부 기능 실패, 4xx 에러, 주요 UI 깨짐
- **minor** — 콘솔 경고, 사소한 이슈

## 리포트 템플릿

```markdown
- **URL**: 대상 페이지
- **심각도**: critical | major | minor
- **증상**: 한 줄 요약
- **콘솔 에러**: 원문
- **네트워크 실패**: URL · 상태 코드
- **재현 스텝**: 1) ... 2) ...
- **환경**: 브라우저 / OS / 뷰포트
- **스크린샷**: 첨부
```

## 작성 규칙

- 콘솔 에러는 **원문 그대로** 인용한다. 의역 금지.
- 네트워크 실패는 URL과 상태 코드를 한 줄에 표기한다 (예: `POST /api/todos · 500`).
- 재현 스텝은 사용자 관점의 행동만 적는다. 내부 함수명 금지.
- 수집 데이터가 비어 있으면 해당 항목에 `없음`이라고 명시한다.
