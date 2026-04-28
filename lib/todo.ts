export type Priority = "high" | "normal" | "low";

export const PRIORITIES: Priority[] = ["high", "normal", "low"];

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "높음",
  normal: "보통",
  low: "낮음",
};

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
