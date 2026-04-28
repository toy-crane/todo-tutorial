import type { Todo } from "@/lib/todo";
import { TodoItem } from "./todo-item";

type Props = {
  todos: Todo[];
  hydrated: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
};

export function TodoList({
  todos,
  hydrated,
  onToggle,
  onRemove,
  onUpdate,
}: Props) {
  if (!hydrated) return null;

  if (todos.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        할 일을 추가해보세요
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
