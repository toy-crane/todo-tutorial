"use client";

import { useTodos } from "@/hooks/use-todos";
import { TodoInput } from "./todo-input";
import { TodoList } from "./todo-list";

export function TodoApp() {
  const { todos, hydrated, addTodo, toggleTodo, removeTodo, updateTodoText } =
    useTodos();

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <TodoInput onAdd={addTodo} />
      <TodoList
        todos={todos}
        hydrated={hydrated}
        onToggle={toggleTodo}
        onRemove={removeTodo}
        onUpdate={updateTodoText}
      />
    </div>
  );
}
