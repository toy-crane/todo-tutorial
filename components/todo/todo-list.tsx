import { ClipboardText } from "@phosphor-icons/react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClipboardText />
          </EmptyMedia>
          <EmptyTitle>{emptyMessage}</EmptyTitle>
          <EmptyDescription>
            상단 입력창에 할 일을 적고 Enter 키를 누르세요.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
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
