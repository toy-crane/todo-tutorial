import { useState } from "react";
import { Calendar as CalendarIcon, X } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  PRIORITIES,
  PRIORITY_LABEL,
  formatDueDate,
  type Priority,
} from "@/lib/todo";

type Props = {
  onAdd: (text: string, priority: Priority, dueDate?: number) => void;
};

const PRIORITY_ACTIVE_CLASS: Record<Priority, string> = {
  high: "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400",
  normal: "border-foreground/40 bg-foreground/5 text-foreground",
  low: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onAdd(value, priority, dueDate ? dueDate.getTime() : undefined);
      setValue("");
      setDueDate(undefined);
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
      <div className="flex items-center gap-2">
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
        <div className="ml-auto flex items-center gap-1">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="마감일 선택"
                className={cn(
                  "flex items-center gap-1 rounded-md border px-3 py-1 text-xs transition-colors",
                  dueDate
                    ? "border-foreground/40 bg-foreground/5 text-foreground"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                <CalendarIcon size={14} />
                {dueDate ? formatDueDate(dueDate.getTime()) : "마감일"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(d) => {
                  setDueDate(d);
                  if (d) setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {dueDate && (
            <button
              type="button"
              aria-label="마감일 지우기"
              onClick={() => setDueDate(undefined)}
              className="text-muted-foreground hover:text-destructive rounded-md p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
