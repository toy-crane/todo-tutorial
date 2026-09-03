"use client";

import { TODO_FILTERS, type TodoFilter } from "@/lib/types";
import { TodoOptionGroup } from "@/components/todo-option-group";

interface TodoFilterProps {
  value: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}

export function TodoFilter({ value, onChange }: TodoFilterProps) {
  return (
    <TodoOptionGroup
      ariaLabel="필터"
      options={TODO_FILTERS}
      value={value}
      onChange={onChange}
    />
  );
}
