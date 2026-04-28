"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/use-todos";
import {
  applyTodoFilter,
  applyTodoSort,
  type TodoFilter,
  type TodoSort,
} from "@/lib/todo";
import { TodoInput } from "./todo-input";
import { TodoList } from "./todo-list";
import { TodoFilters } from "./todo-filter";
import { TodoSorts } from "./todo-sort";

export function TodoApp() {
  const { todos, hydrated, addTodo, toggleTodo, removeTodo, updateTodoText } =
    useTodos();
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [sort, setSort] = useState<TodoSort>("createdAt");

  function selectFilter(next: TodoFilter) {
    setFilter(next);
    setSort("createdAt");
  }

  function selectSort(next: TodoSort) {
    setSort(next);
    setFilter("all");
  }

  const visibleTodos = applyTodoSort(applyTodoFilter(todos, filter), sort);
  const emptyMessage =
    filter === "all" ? "할 일을 추가해보세요" : "할 일이 없습니다";

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <TodoInput onAdd={addTodo} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TodoFilters value={filter} onChange={selectFilter} />
        <TodoSorts value={sort} onChange={selectSort} />
      </div>
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
