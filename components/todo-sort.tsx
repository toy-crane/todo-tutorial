"use client";

import { SORT_OPTIONS, type SortBy } from "@/lib/types";
import { TodoOptionGroup } from "@/components/todo-option-group";

interface TodoSortProps {
  value: SortBy;
  onChange: (value: SortBy) => void;
}

export function TodoSort({ value, onChange }: TodoSortProps) {
  return (
    <TodoOptionGroup
      ariaLabel="정렬"
      options={SORT_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
