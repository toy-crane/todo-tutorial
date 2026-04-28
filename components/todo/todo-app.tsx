"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/use-todos";
import { applyTodoFilter, type TodoFilter } from "@/lib/todo";
import { TodoInput } from "./todo-input";
import { TodoList } from "./todo-list";
import { TodoFilters } from "./todo-filter";

export function TodoApp() {
  const { todos, hydrated, addTodo, toggleTodo, removeTodo, updateTodoText } =
    useTodos();
  const [filter, setFilter] = useState<TodoFilter>("all");

  const visibleTodos = applyTodoFilter(todos, filter);
  const emptyMessage =
    filter === "all" ? "할 일을 추가해보세요" : "할 일이 없습니다";

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <TodoInput onAdd={addTodo} />
      <TodoFilters value={filter} onChange={setFilter} />
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
