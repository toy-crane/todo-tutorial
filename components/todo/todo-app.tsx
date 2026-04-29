"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/use-todos";
import {
  applyCategoryFilter,
  applyTodoFilter,
  applyTodoSearch,
  applyTodoSort,
  type CategoryFilter,
  type TodoFilter,
  type TodoSort,
} from "@/lib/todo";
import { TodoInput } from "./todo-input";
import { TodoList } from "./todo-list";
import { TodoFilters } from "./todo-filter";
import { TodoSorts } from "./todo-sort";
import { TodoSearch } from "./todo-search";
import { TodoCategoryFilter } from "./todo-category-filter";

export function TodoApp() {
  const { todos, hydrated, addTodo, toggleTodo, removeTodo, updateTodoText } =
    useTodos();
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [sort, setSort] = useState<TodoSort>("createdAt");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");

  function selectFilter(next: TodoFilter) {
    setFilter(next);
    setSort("createdAt");
    setCategoryFilter("all");
  }

  function selectSort(next: TodoSort) {
    setSort(next);
    setFilter("all");
    setCategoryFilter("all");
  }

  function selectCategoryFilter(next: CategoryFilter) {
    setCategoryFilter(next);
    setFilter("all");
    setSort("createdAt");
  }

  const visibleTodos = applyTodoSort(
    applyCategoryFilter(
      applyTodoSearch(applyTodoFilter(todos, filter), query),
      categoryFilter,
    ),
    sort,
  );
  const isFiltered =
    filter !== "all" || categoryFilter !== "all" || query.trim().length > 0;
  const emptyMessage = isFiltered ? "할 일이 없습니다" : "할 일을 추가해보세요";

  return (
    <div className="flex w-full flex-col gap-4">
      <TodoInput onAdd={addTodo} />
      <TodoSearch value={query} onChange={setQuery} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TodoFilters value={filter} onChange={selectFilter} />
        <TodoSorts value={sort} onChange={selectSort} />
      </div>
      <TodoCategoryFilter
        value={categoryFilter}
        onChange={selectCategoryFilter}
      />
      <TodoList
        todos={visibleTodos}
        hydrated={hydrated}
        emptyMessage={emptyMessage}
        onToggle={toggleTodo}
        onRemove={removeTodo}
        onUpdate={updateTodoText}
      />
    </div>
  );
}
