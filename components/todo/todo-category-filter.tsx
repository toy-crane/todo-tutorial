import { cn } from "@/lib/utils";
import { CATEGORIES, CATEGORY_LABEL, type CategoryFilter } from "@/lib/todo";

type Props = {
  value: CategoryFilter;
  onChange: (filter: CategoryFilter) => void;
};

const OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "전체" },
  ...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABEL[c] })),
];

export function TodoCategoryFilter({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="카테고리 필터"
      className="flex items-center gap-2"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md border px-3 py-1 text-xs transition-colors",
              active
                ? "border-foreground/40 bg-foreground/5 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
