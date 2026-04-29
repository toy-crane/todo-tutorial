import { useState } from "react";
import { Calendar as CalendarIcon, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  PRIORITIES,
  PRIORITY_LABEL,
  formatDueDate,
  type Category,
  type Priority,
} from "@/lib/todo";

type Props = {
  onAdd: (
    text: string,
    priority: Priority,
    dueDate: number | undefined,
    categories: Category[],
  ) => void;
};

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onAdd(value, priority, dueDate ? dueDate.getTime() : undefined, categories);
      setValue("");
      setDueDate(undefined);
      setCategories([]);
    }
  }

  return (
    <FieldGroup className="gap-3">
      <Field>
        <Input
          placeholder="할 일을 입력하고 Enter 를 누르세요"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Field>
      <Field orientation="horizontal">
        <ToggleGroup
          type="single"
          value={priority}
          onValueChange={(next) => {
            if (next) setPriority(next as Priority);
          }}
          variant="outline"
          size="sm"
          aria-label="우선순위"
        >
          {PRIORITIES.map((p) => (
            <ToggleGroupItem key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="ml-auto flex items-center gap-1">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="마감일 선택"
              >
                <CalendarIcon data-icon="inline-start" />
                {dueDate ? formatDueDate(dueDate.getTime()) : "마감일"}
              </Button>
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
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="마감일 지우기"
              onClick={() => setDueDate(undefined)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X />
            </Button>
          )}
        </div>
      </Field>
      <Field>
        <ToggleGroup
          type="multiple"
          value={categories}
          onValueChange={(next) => setCategories(next as Category[])}
          variant="outline"
          size="sm"
          aria-label="카테고리"
        >
          {CATEGORIES.map((c) => (
            <ToggleGroupItem
              key={c}
              value={c}
              aria-label={CATEGORY_LABEL[c]}
            >
              {CATEGORY_LABEL[c]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>
    </FieldGroup>
  );
}
