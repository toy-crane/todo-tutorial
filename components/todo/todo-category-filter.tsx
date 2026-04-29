import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as CategoryFilter);
      }}
      variant="outline"
      size="sm"
      aria-label="카테고리 필터"
    >
      {OPTIONS.map((opt) => (
        <ToggleGroupItem key={opt.value} value={opt.value}>
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
