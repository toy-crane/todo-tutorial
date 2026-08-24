import type { SortBy, Todo } from "@/lib/types";

/**
 * 정렬 기준에 따라 정렬된 새 배열을 반환한다(원본 불변).
 * - created: 생성 시각 내림차순(최신순)
 * - name: 제목 가나다순(오름차순)
 * - due: 마감일 가까운 순(오름차순), 마감일 없는 항목은 맨 뒤
 */
export function sortTodos(todos: Todo[], sortBy: SortBy): Todo[] {
  const sorted = [...todos];
  if (sortBy === "name") {
    sorted.sort((a, b) => a.text.localeCompare(b.text, "ko"));
  } else if (sortBy === "created") {
    sorted.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortBy === "due") {
    sorted.sort((a, b) => {
      // 마감일 없는 항목(undefined)은 항상 뒤로 보낸다.
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      // "YYYY-MM-DD" 문자열은 사전순 비교가 곧 날짜순 비교.
      return a.dueDate.localeCompare(b.dueDate);
    });
  }
  return sorted;
}

/**
 * 제목에 검색어가 포함되는지 검사한다(대소문자 무시).
 * 검색어가 비어 있으면(공백 포함) 항상 true를 반환한다.
 */
export function matchesSearch(todo: Todo, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return todo.text.toLowerCase().includes(q);
}
