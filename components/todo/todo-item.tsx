import { useRef, useState } from "react";
import { Trash } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Todo } from "@/lib/todo";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
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
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive size-7 shrink-0"
        onClick={() => onRemove(todo.id)}
      >
        <Trash size={16} />
      </Button>
    </div>
  );
}
