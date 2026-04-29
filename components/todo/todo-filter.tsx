import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as TodoFilter);
      }}
      variant="outline"
      size="sm"
      aria-label="상태 필터"
    >
      {TODO_FILTERS.map((f) => (
        <ToggleGroupItem key={f} value={f}>
          {TODO_FILTER_LABEL[f]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
