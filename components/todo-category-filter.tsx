"use client";

import { CATEGORY_FILTERS, type CategoryFilter } from "@/lib/types";
import { TodoOptionGroup } from "@/components/todo-option-group";

interface TodoCategoryFilterProps {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}

export function TodoCategoryFilter({
  value,
  onChange,
}: TodoCategoryFilterProps) {
  return (
    <TodoOptionGroup
      ariaLabel="카테고리 필터"
      options={CATEGORY_FILTERS}
      value={value}
      onChange={onChange}
    />
  );
}
