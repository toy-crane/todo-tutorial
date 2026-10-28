"use client";

import { useEffect, useRef, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import {
  CATEGORY_META,
  DEFAULT_PRIORITY,
  PRIORITY_META,
  type Todo,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  // 키보드(Enter/Escape)로 편집을 끝냈는지 여부 — 이때만 포커스를 텍스트로 되돌린다.
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    } else if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      textRef.current?.focus();
    }
  }, [editing]);

  function startEditing() {
    setDraft(todo.text);
    setEditing(true);
  }

  function commit() {
    setEditing(false);
    onEdit(todo.id, draft);
  }

  function cancel() {
    setEditing(false);
    setDraft(todo.text);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // IME 조합 중(한글 등)에 확정용으로 누른 Enter는 무시한다.
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter") {
      event.preventDefault();
      restoreFocusRef.current = true;
      commit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      restoreFocusRef.current = true;
      cancel();
    }
  }

  // 마우스 더블클릭과 같은 편집 진입을 키보드에서도 제공한다.
  function handleTextKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter" || event.key === " " || event.key === "F2") {
      event.preventDefault();
      startEditing();
    }
  }

  const priority = PRIORITY_META[todo.priority] ?? PRIORITY_META[DEFAULT_PRIORITY];
  const category = todo.category ? CATEGORY_META[todo.category] : undefined;

  return (
    <li className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={todo.completed ? "완료 취소" : "완료로 표시"}
      />

      {editing ? (
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          className="h-7 flex-1"
          aria-label="할 일 편집"
        />
      ) : (
        <span
          ref={textRef}
          role="button"
          tabIndex={0}
          aria-label={`편집: ${todo.text}`}
          onDoubleClick={startEditing}
          onKeyDown={handleTextKeyDown}
          className={cn(
            "min-w-0 flex-1 cursor-pointer rounded-sm outline-none [overflow-wrap:anywhere] focus-visible:ring-2 focus-visible:ring-ring/30",
            todo.completed && "text-muted-foreground line-through"
          )}
        >
          {todo.text}
        </span>
      )}

      {todo.dueDate && (
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {todo.dueDate}
        </span>
      )}

      {category && (
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[0.625rem] font-medium leading-none",
            category.badgeClass
          )}
        >
          {category.label}
        </span>
      )}

      <span
        className={cn(
          "shrink-0 rounded-full border px-2 py-0.5 text-[0.625rem] font-medium leading-none",
          priority.badgeClass
        )}
      >
        {priority.label}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(todo.id)}
        aria-label="삭제"
      >
        <XIcon />
      </Button>
    </li>
  );
}
