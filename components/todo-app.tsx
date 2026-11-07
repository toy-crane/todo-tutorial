"use client"

import { useRef, useState } from "react"
import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useTodos, type Category, type Todo } from "@/hooks/use-todos"
import { cn } from "@/lib/utils"

type Filter = "all" | "active" | "completed"
type Sort = "created" | "name" | "due"

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
]

const SORTS: { value: Sort; label: string }[] = [
  { value: "created", label: "생성일순" },
  { value: "name", label: "이름순" },
  { value: "due", label: "마감일순" },
]

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "work", label: "업무" },
  { value: "personal", label: "개인" },
  { value: "shopping", label: "쇼핑" },
]

const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map(({ value, label }) => [value, label])
) as Record<Category, string>

// 정렬 비교 함수. 0을 돌려주면 저장된 순서(최근 추가가 위)를 유지한다
const COMPARE: Record<Sort, (a: Todo, b: Todo) => number> = {
  created: (a, b) =>
    a.createdAt !== undefined && b.createdAt !== undefined
      ? b.createdAt - a.createdAt
      : 0,
  name: (a, b) => a.text.localeCompare(b.text, "ko"),
  // 마감일 없는 항목은 맨 뒤
  due: (a, b) => {
    if (a.dueDate === b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate < b.dueDate ? -1 : 1
  },
}

export function TodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo } = useTodos()
  const [draft, setDraft] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState<Category | "">("")
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<Sort>("created")
  const [query, setQuery] = useState("")
  const [categoryView, setCategoryView] = useState<Category | "all">("all")

  const keyword = query.trim().toLowerCase()
  const visibleTodos = todos
    .filter((todo) =>
      filter === "all"
        ? true
        : filter === "active"
          ? !todo.completed
          : todo.completed
    )
    .filter((todo) => !keyword || todo.text.toLowerCase().includes(keyword))
    .filter((todo) => categoryView === "all" || todo.category === categoryView)
    .sort(COMPARE[sort])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter는 무시 (중복 추가 방지)
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return
    const text = draft.trim()
    if (!text) return
    addTodo(text, {
      dueDate: dueDate || undefined,
      category: category || undefined,
    })
    setDraft("")
    setDueDate("")
    setCategory("")
    // 새 항목이 필터·검색에 가려지지 않도록 전체 보기로 돌아간다
    setFilter("all")
    setQuery("")
    setCategoryView("all")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하고 Enter"
          aria-label="새 할 일"
          autoFocus
          className="flex-1"
        />
        <div className="flex gap-2">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="마감일"
            className="w-auto"
          />
          <NativeSelect
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "")}
            aria-label="카테고리"
          >
            <NativeSelectOption value="">카테고리 없음</NativeSelectOption>
            {CATEGORIES.map(({ value, label }) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제목으로 검색"
        aria-label="검색"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="필터" className="flex gap-1">
          {FILTERS.map(({ value, label }) => (
            <Button
              key={value}
              variant={filter === value ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <NativeSelect
          value={categoryView}
          onChange={(e) => setCategoryView(e.target.value as Category | "all")}
          aria-label="카테고리 보기"
        >
          <NativeSelectOption value="all">전체</NativeSelectOption>
          {CATEGORIES.map(({ value, label }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div role="group" aria-label="정렬" className="flex gap-1">
        {SORTS.map(({ value, label }) => (
          <Button
            key={value}
            variant={sort === value ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={sort === value}
            onClick={() => setSort(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      {visibleTodos.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {todos.length === 0
            ? "할 일이 없습니다"
            : "해당하는 할 일이 없습니다"}
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
              onEdit={(text) => editTodo(todo.id, text)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
  onEdit: (text: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(todo.text)
  // 편집 종료 후 언마운트 시 발생하는 blur가 다시 저장하지 않도록 막는다
  const editingRef = useRef(false)

  const startEdit = () => {
    setValue(todo.text)
    editingRef.current = true
    setEditing(true)
  }

  const finish = () => {
    editingRef.current = false
    setEditing(false)
  }

  const commit = () => {
    if (!editingRef.current) return
    const text = value.trim()
    // 빈 값이면 원래 텍스트 유지
    if (text && text !== todo.text) onEdit(text)
    finish()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === "Enter") commit()
    if (e.key === "Escape") finish()
  }

  return (
    <li className="group flex min-h-11 items-center gap-3 rounded-lg px-2 hover:bg-muted/50">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={onToggle}
        aria-label={`${todo.text} 완료`}
      />
      {editing ? (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          aria-label="할 일 수정"
          autoFocus
          className="h-8 flex-1"
        />
      ) : (
        <span
          data-testid="todo-text"
          onDoubleClick={startEdit}
          className={cn(
            "flex-1 cursor-text py-2 text-sm break-all select-none",
            todo.completed && "text-muted-foreground line-through"
          )}
        >
          {todo.text}
        </span>
      )}
      {todo.category && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {CATEGORY_LABEL[todo.category]}
        </span>
      )}
      {todo.dueDate && (
        <span className="text-xs whitespace-nowrap text-muted-foreground">
          마감 {todo.dueDate}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onDelete}
        aria-label={`${todo.text} 삭제`}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2Icon />
      </Button>
    </li>
  )
}
