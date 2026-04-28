import type { Todo } from "@/lib/todo";
import { TodoItem } from "./todo-item";

type Props = {
  todos: Todo[];
  hydrated: boolean;
  emptyMessage: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
};

export function TodoList({
  todos,
  hydrated,
  emptyMessage,
  onToggle,
  onRemove,
  onUpdate,
}: Props) {
  if (!hydrated) return null;

  if (todos.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onRemove={onRemove}
            onUpdate={onUpdate}
          />
        </li>
      ))}
    </ul>
  );
}
