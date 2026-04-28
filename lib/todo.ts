export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export function createTodo(text: string): Todo {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
  };
}
