export type Priority = "high" | "normal" | "low";

export const PRIORITIES: Priority[] = ["high", "normal", "low"];

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "높음",
  normal: "보통",
  low: "낮음",
};

export type TodoFilter = "all" | "active" | "completed";

export const TODO_FILTERS: TodoFilter[] = ["all", "active", "completed"];

export const TODO_FILTER_LABEL: Record<TodoFilter, string> = {
  all: "전체",
  active: "진행중",
  completed: "완료",
};

export function applyTodoFilter(todos: Todo[], filter: TodoFilter): Todo[] {
  if (filter === "active") return todos.filter((t) => !t.completed);
  if (filter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
};

export function createTodo(text: string, priority: Priority = "normal"): Todo {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    priority,
    createdAt: Date.now(),
  };
}
