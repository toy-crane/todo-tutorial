import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PRIORITIES,
  PRIORITY_LABEL,
  type Priority,
} from "@/lib/todo";

type Props = {
  onAdd: (text: string, priority: Priority) => void;
};

const PRIORITY_ACTIVE_CLASS: Record<Priority, string> = {
  high: "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400",
  normal: "border-foreground/40 bg-foreground/5 text-foreground",
  low: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onAdd(value, priority);
      setValue("");
    }
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="할 일을 입력하고 Enter 를 누르세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div
        role="radiogroup"
        aria-label="우선순위"
        className="flex items-center gap-2"
      >
        {PRIORITIES.map((p) => {
          const active = priority === p;
          return (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setPriority(p)}
              className={cn(
                "rounded-md border px-3 py-1 text-xs transition-colors",
                active
                  ? PRIORITY_ACTIVE_CLASS[p]
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {PRIORITY_LABEL[p]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
