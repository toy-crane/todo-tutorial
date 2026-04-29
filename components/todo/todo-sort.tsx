import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TODO_SORTS, TODO_SORT_LABEL, type TodoSort } from "@/lib/todo";

type Props = {
  value: TodoSort;
  onChange: (sort: TodoSort) => void;
};

export function TodoSorts({ value, onChange }: Props) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as TodoSort);
      }}
      variant="outline"
      size="sm"
      aria-label="정렬"
    >
      {TODO_SORTS.map((s) => (
        <ToggleGroupItem key={s} value={s}>
          {TODO_SORT_LABEL[s]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
