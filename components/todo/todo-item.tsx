import { useRef, useState } from "react";
import { Trash } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
  formatDueDate,
  type Category,
  type Priority,
  type Todo,
} from "@/lib/todo";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
};

const PRIORITY_BADGE_CLASS: Record<Priority, string> = {
  high: "bg-red-500/15 text-red-600 dark:text-red-400",
  normal: "",
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

const CATEGORY_BADGE_CLASS: Record<Category, string> = {
  work: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  personal: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  shopping: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
};

export function TodoItem({ todo, onToggle, onRemove, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const originalRef = useRef(todo.text);

  function startEdit() {
    originalRef.current = todo.text;
    setDraft(todo.text);
    setEditing(true);
  }

  function commitEdit() {
    setEditing(false);
    onUpdate(todo.id, draft);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(originalRef.current);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") cancelEdit();
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
      />
      {editing ? (
        <Input
          autoFocus
          className="h-auto flex-1 border-none p-0 shadow-none focus-visible:ring-0"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
        />
      ) : (
        <span
          className={cn(
            "flex-1 cursor-default select-none",
            todo.completed && "text-muted-foreground line-through opacity-50",
          )}
          onDoubleClick={startEdit}
        >
          {todo.text}
        </span>
      )}
      {todo.dueDate !== undefined && (
        <span
          className={cn(
            "text-muted-foreground shrink-0 text-xs tabular-nums",
            todo.completed && "opacity-50",
          )}
          aria-label={`마감일 ${formatDueDate(todo.dueDate)}`}
        >
          {formatDueDate(todo.dueDate)}
        </span>
      )}
      {todo.categories.map((c) => (
        <Badge
          key={c}
          variant="secondary"
          className={cn(
            CATEGORY_BADGE_CLASS[c],
            todo.completed && "opacity-50",
          )}
          aria-label={`카테고리 ${CATEGORY_LABEL[c]}`}
        >
          {CATEGORY_LABEL[c]}
        </Badge>
      ))}
      <Badge
        variant="secondary"
        className={cn(
          PRIORITY_BADGE_CLASS[todo.priority],
          todo.completed && "opacity-50",
        )}
        aria-label={`우선순위 ${PRIORITY_LABEL[todo.priority]}`}
      >
        {PRIORITY_LABEL[todo.priority]}
      </Badge>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:text-destructive"
        aria-label="삭제"
        onClick={() => onRemove(todo.id)}
      >
        <Trash />
      </Button>
    </div>
  );
}
