/**
 * 메인 페이지 - Todo 앱의 진입점
 *
 * 중앙 정렬된 레이아웃에서 Todo 앱의 주요 인터페이스를 제공합니다.
 * 제목, 설명, Todo 리스트 관리 컴포넌트, 키보드 단축키 안내를 포함합니다.
 */

import { TodoApp } from "@/components/todo/todo-app";

/**
 * 메인 페이지 컴포넌트
 *
 * 전체 뷰포트를 차지하는 레이아웃에서:
 * - 상단: 앱 제목과 설명
 * - 중앙: Todo 앱 컴포넌트 (추가, 편집, 삭제 기능)
 * - 하단: 다크모드 단축키 안내 (d 키)
 *
 * @returns Todo 앱 메인 페이지 렌더링
 */
export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center p-8">
      {/* 최대 너비 제한으로 모바일에서도 가독성 유지 */}
      <div className="w-full max-w-lg space-y-6">
        {/* 앱 헤더: 제목과 설명 */}
        <div>
          <h1 className="text-2xl font-semibold">Todo</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            오늘 해야 할 일을 기록하세요
          </p>
        </div>

        {/* Todo 리스트 관리 컴포넌트 */}
        <TodoApp />

        {/* 사용자 안내: 키보드 단축키 */}
        <p className="text-muted-foreground text-center text-xs">
          <kbd>d</kbd> 키로 다크 모드 전환
        </p>
      </div>
    </div>
  );
}
