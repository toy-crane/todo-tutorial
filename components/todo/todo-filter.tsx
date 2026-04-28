import { cn } from "@/lib/utils";
import {
  TODO_FILTERS,
  TODO_FILTER_LABEL,
  type TodoFilter,
} from "@/lib/todo";

type Props = {
  value: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      {TODO_FILTERS.map((f) => {
        const active = value === f;
        return (
          <button
            key={f}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f)}
            className={cn(
              "rounded-md border px-3 py-1 text-xs transition-colors",
              active
                ? "border-foreground/40 bg-foreground/5 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {TODO_FILTER_LABEL[f]}
          </button>
        );
      })}
    </div>
  );
}
