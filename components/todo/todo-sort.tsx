import { cn } from "@/lib/utils";
import { TODO_SORTS, TODO_SORT_LABEL, type TodoSort } from "@/lib/todo";

type Props = {
  value: TodoSort;
  onChange: (sort: TodoSort) => void;
};

export function TodoSorts({ value, onChange }: Props) {
  return (
    <div role="group" aria-label="정렬" className="flex items-center gap-2">
      {TODO_SORTS.map((s) => {
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(s)}
            className={cn(
              "rounded-md border px-3 py-1 text-xs transition-colors",
              active
                ? "border-foreground/40 bg-foreground/5 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {TODO_SORT_LABEL[s]}
          </button>
        );
      })}
    </div>
  );
}
