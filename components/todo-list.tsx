"use client";

import { useState } from "react";
import type {
  CategoryFilter,
  SortBy,
  TodoFilter as TodoFilterValue,
} from "@/lib/types";
import { matchesSearch, sortTodos } from "@/lib/todo-utils";
import { useTodos } from "@/hooks/use-todos";
import { TodoInput } from "@/components/todo-input";
import { TodoFilter } from "@/components/todo-filter";
import { TodoCategoryFilter } from "@/components/todo-category-filter";
import { TodoSort } from "@/components/todo-sort";
import { TodoSearch } from "@/components/todo-search";
import { TodoItem } from "@/components/todo-item";

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="w-16 shrink-0 text-xs text-muted-foreground"
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export function TodoList() {
  const { todos, loaded, addTodo, toggleTodo, deleteTodo, editTodo } =
    useTodos();
  const [filter, setFilter] = useState<TodoFilterValue>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("created");
  const [query, setQuery] = useState("");

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter(
      (todo) => categoryFilter === "all" || todo.category === categoryFilter
    )
    .filter((todo) => matchesSearch(todo, query));
  const visibleTodos = sortTodos(filteredTodos, sortBy);

  return (
    <div className="flex flex-col gap-4">
      <TodoInput onAdd={addTodo} />

      <TodoSearch value={query} onChange={setQuery} />

      <div className="flex flex-col gap-3 border border-border p-3">
        <FilterRow label="상태">
          <TodoFilter value={filter} onChange={setFilter} />
        </FilterRow>
        <FilterRow label="카테고리">
          <TodoCategoryFilter
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </FilterRow>
        <FilterRow label="정렬">
          <TodoSort value={sortBy} onChange={setSortBy} />
        </FilterRow>
      </div>

      {loaded && visibleTodos.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          아직 할 일이 없습니다. 위에 입력해 추가해보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
