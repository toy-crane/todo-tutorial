"use client"

import { useCallback, useSyncExternalStore } from "react"

export type Category = "work" | "personal" | "shopping"

export type Todo = {
  id: string
  text: string
  completed: boolean
  /** 생성 시각(ms). 예전 데이터에는 없을 수 있다 */
  createdAt?: number
  /** YYYY-MM-DD */
  dueDate?: string
  category?: Category
}

export type NewTodoOptions = {
  dueDate?: string
  category?: Category
}

const STORAGE_KEY = "todos"
const EMPTY: Todo[] = []

const listeners = new Set<() => void>()
let cachedRaw: string | null = null
let cachedTodos: Todo[] = EMPTY

function readTodos(): Todo[] {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === cachedRaw) return cachedTodos
  cachedRaw = raw
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cachedTodos = Array.isArray(parsed) ? (parsed as Todo[]) : EMPTY
  } catch {
    cachedTodos = EMPTY
  }
  return cachedTodos
}

function writeTodos(todos: Todo[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // 다른 탭에서 바뀐 내용도 반영
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function useTodos() {
  const todos = useSyncExternalStore(subscribe, readTodos, () => EMPTY)

  const update = useCallback((fn: (prev: Todo[]) => Todo[]) => {
    writeTodos(fn(readTodos()))
  }, [])

  const addTodo = useCallback(
    (text: string, { dueDate, category }: NewTodoOptions = {}) =>
      update((prev) => [
        {
          id: crypto.randomUUID(),
          text,
          completed: false,
          createdAt: Date.now(),
          ...(dueDate && { dueDate }),
          ...(category && { category }),
        },
        ...prev,
      ]),
    [update]
  )

  const toggleTodo = useCallback(
    (id: string) =>
      update((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      ),
    [update]
  )

  const deleteTodo = useCallback(
    (id: string) => update((prev) => prev.filter((t) => t.id !== id)),
    [update]
  )

  const editTodo = useCallback(
    (id: string, text: string) =>
      update((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t))),
    [update]
  )

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo }
}
