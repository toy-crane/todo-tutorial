"use client";

import { useEffect, useState } from "react";
import { createTodo, type Todo } from "@/lib/todo";

const STORAGE_KEY = "todo-tutorial:todos";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTodos(JSON.parse(raw) as Todo[]);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, hydrated]);

  function addTodo(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [createTodo(trimmed), ...prev]);
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTodoText(id: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) {
      removeTodo(id);
      return;
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)),
    );
  }

  return { todos, hydrated, addTodo, toggleTodo, removeTodo, updateTodoText };
}
