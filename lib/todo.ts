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

export type TodoSort = "createdAt" | "name";

export const TODO_SORTS: TodoSort[] = ["createdAt", "name"];

export const TODO_SORT_LABEL: Record<TodoSort, string> = {
  createdAt: "생성일순",
  name: "이름순",
};

export function applyTodoSort(todos: Todo[], sort: TodoSort): Todo[] {
  if (sort === "name") {
    return [...todos].sort((a, b) => a.text.localeCompare(b.text, "ko"));
  }
  return [...todos].sort((a, b) => b.createdAt - a.createdAt);
}

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  dueDate?: number;
};

export function createTodo(
  text: string,
  priority: Priority = "normal",
  dueDate?: number,
): Todo {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    priority,
    createdAt: Date.now(),
    dueDate,
  };
}

export function formatDueDate(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
