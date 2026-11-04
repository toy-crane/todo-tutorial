import type { Todo } from "@/lib/types";

// 테스트용 Todo를 만든다. 필요한 필드만 overrides로 덮어쓴다.
export function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "1",
    text: "테스트 할 일",
    completed: false,
    priority: "medium",
    createdAt: 0,
    ...overrides,
  };
}
