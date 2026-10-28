"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_PRIORITY,
  type Category,
  type Priority,
  type Todo,
} from "@/lib/types";

const STORAGE_KEY = "todos";

// 저장된 문자열을 Todo 배열로 변환한다. 형식이 맞지 않으면 예외를 던진다.
function parseStoredTodos(stored: string): Todo[] {
  // priority/createdAt 도입 이전에 저장된 데이터와의 호환을 위해 기본값으로 보정
  const parsed = JSON.parse(stored) as (Omit<Todo, "priority" | "createdAt"> & {
    priority?: Priority;
    createdAt?: number;
  })[];
  // createdAt이 없던 데이터는 기존 배열 순서(앞쪽이 최신)를 유지하도록
  // index가 작을수록 큰 값을 부여한다.
  const base = Date.now();
  return parsed.map((todo, index) => ({
    ...todo,
    priority: todo.priority ?? DEFAULT_PRIORITY,
    createdAt: todo.createdAt ?? base - index,
  }));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);
  // 로드 시 파싱 실패 여부 — 손상된 localStorage를 빈 배열로 덮어쓰지 않기 위해 사용
  const loadErrorRef = useRef(false);

  // 다른 탭에서 받은 값으로 상태를 바꿨는지 여부 — 받은 값을 다시 저장하지 않기 위해 사용
  const syncedFromStorageRef = useRef(false);

  // 마운트 후 localStorage에서 로드 (SSR hydration mismatch 방지)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // 마운트 후 localStorage 값으로 동기화 — hydration mismatch 방지를 위해 의도적으로 effect에서 설정
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTodos(parseStoredTodos(stored));
      }
    } catch {
      // 파싱 실패 시 빈 목록 유지하되, 손상된 데이터를 자동으로 덮어쓰지 않도록 표시
      loadErrorRef.current = true;
    }
    setLoaded(true);
  }, []);

  // 다른 탭의 변경을 반영 — 각 탭이 자기 배열 전체를 덮어쓰면 다른 탭의 변경이 사라진다.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.storageArea !== localStorage) return;
      // key가 null이면 다른 탭이 localStorage.clear()를 호출한 것이다.
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      let next: Todo[];
      try {
        next = event.newValue ? parseStoredTodos(event.newValue) : [];
      } catch {
        // 손상된 값은 반영하지 않고 현재 상태를 유지한다.
        return;
      }
      loadErrorRef.current = false;
      syncedFromStorageRef.current = true;
      setTodos(next);
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // 변경 시 저장 (로드 완료 후에만 — 초기 빈 배열이 기존 데이터를 덮어쓰지 않도록)
  useEffect(() => {
    if (!loaded) return;
    // 다른 탭에서 받은 값은 이미 저장돼 있으므로 다시 쓰지 않는다.
    if (syncedFromStorageRef.current) {
      syncedFromStorageRef.current = false;
      return;
    }
    // 로드 실패 후 사용자가 아무것도 추가하지 않았다면 손상된 원본을 빈 배열로 덮어쓰지 않는다.
    if (loadErrorRef.current && todos.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, loaded]);

  function addTodo(
    text: string,
    priority: Priority = DEFAULT_PRIORITY,
    dueDate?: string,
    category?: Category
  ) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      priority,
      createdAt: Date.now(),
      dueDate: dueDate || undefined,
      category,
    };
    setTodos((prev) => [todo, ...prev]);
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function editTodo(id: string, text: string) {
    const trimmed = text.trim();
    // 빈 문자열로 편집하면 삭제 처리
    if (!trimmed) {
      deleteTodo(id);
      return;
    }
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    );
  }

  return { todos, loaded, addTodo, toggleTodo, deleteTodo, editTodo };
}
