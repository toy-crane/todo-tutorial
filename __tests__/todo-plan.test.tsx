import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { TodoApp } from "@/components/todo-app"

type SeedTodo = {
  id: string
  text: string
  completed: boolean
  createdAt?: number
  dueDate?: string
  category?: string
}

function seed(todos: SeedTodo[]) {
  window.localStorage.setItem("todos", JSON.stringify(todos))
}

function setup() {
  const user = userEvent.setup()
  render(<TodoApp />)
  const input = screen.getByRole("textbox", { name: "새 할 일" })
  const dueInput = screen.getByLabelText("마감일")
  const categorySelect = screen.getByRole("combobox", { name: "카테고리" })
  const addTodo = async (
    text: string,
    opts: { dueDate?: string; category?: string } = {}
  ) => {
    if (opts.dueDate) await user.type(dueInput, opts.dueDate)
    if (opts.category) await user.selectOptions(categorySelect, opts.category)
    await user.type(input, `${text}{Enter}`)
  }
  const sortBy = (name: "생성일순" | "이름순" | "마감일순") =>
    user.click(
      within(screen.getByRole("group", { name: "정렬" })).getByRole("button", {
        name,
      })
    )
  const search = screen.getByRole("searchbox", { name: "검색" })
  const categoryView = screen.getByRole("combobox", { name: "카테고리 보기" })
  const titles = () =>
    screen.queryAllByTestId("todo-text").map((el) => el.textContent)
  const itemOf = (text: string) =>
    screen
      .getByText(text, { selector: "[data-testid=todo-text]" })
      .closest("li")!
  return {
    user,
    addTodo,
    sortBy,
    search,
    categoryView,
    titles,
    itemOf,
  }
}

describe("1. 마감일", () => {
  it("마감일 없이 Todo 추가 -> 추가되고, 마감일은 표시되지 않음", async () => {
    const { addTodo, titles, itemOf } = setup()

    await addTodo("장보기")

    expect(titles()).toEqual(["장보기"])
    expect(within(itemOf("장보기")).queryByText(/마감/)).not.toBeInTheDocument()
  })

  it("마감일을 정해 Todo 추가 -> 목록에 마감일이 표시됨", async () => {
    const { addTodo, titles, itemOf } = setup()

    await addTodo("보고서 제출", { dueDate: "2026-11-20" })

    expect(titles()).toEqual(["보고서 제출"])
    expect(
      within(itemOf("보고서 제출")).getByText("마감 2026-11-20")
    ).toBeInTheDocument()
  })
})

describe("2. 이름순·생성일순 정렬", () => {
  // 저장 순서와 생성 시각 순서를 일부러 다르게 둔다
  const SEED: SeedTodo[] = [
    { id: "1", text: "나무 심기", completed: false, createdAt: 2000 },
    { id: "2", text: "다림질", completed: false, createdAt: 3000 },
    { id: "3", text: "가계부 정리", completed: false, createdAt: 1000 },
  ]

  it("Todo 3개에서 '이름순' 선택 -> 가나다순으로 표시", async () => {
    seed(SEED)
    const { sortBy, titles } = setup()

    await sortBy("이름순")

    expect(titles()).toEqual(["가계부 정리", "나무 심기", "다림질"])
  })

  it("같은 상태에서 '생성일순' 선택 -> 최근에 추가한 항목부터 표시", async () => {
    seed(SEED)
    const { sortBy, titles } = setup()

    await sortBy("이름순")
    await sortBy("생성일순")

    expect(titles()).toEqual(["다림질", "나무 심기", "가계부 정리"])
  })
})

describe("3. 마감일순 정렬", () => {
  it("'마감일순' 선택 -> 마감일이 가까운 항목부터 표시", async () => {
    seed([
      { id: "1", text: "A", completed: false, dueDate: "2026-12-01" },
      { id: "2", text: "B", completed: false, dueDate: "2026-11-10" },
      { id: "3", text: "C", completed: false, dueDate: "2026-11-20" },
    ])
    const { sortBy, titles } = setup()

    await sortBy("마감일순")

    expect(titles()).toEqual(["B", "C", "A"])
  })

  it("마감일 없는 항목 2개와 있는 항목 3개에서 '마감일순' 선택 -> 마감일 없는 항목이 맨 뒤", async () => {
    seed([
      { id: "1", text: "없음1", completed: false },
      { id: "2", text: "A", completed: false, dueDate: "2026-12-01" },
      { id: "3", text: "없음2", completed: false },
      { id: "4", text: "B", completed: false, dueDate: "2026-11-10" },
      { id: "5", text: "C", completed: false, dueDate: "2026-11-20" },
    ])
    const { sortBy, titles } = setup()

    await sortBy("마감일순")

    const result = titles()
    expect(result.slice(0, 3)).toEqual(["B", "C", "A"])
    expect(result.slice(3).sort()).toEqual(["없음1", "없음2"])
  })
})

describe("4. 검색", () => {
  const SEED: SeedTodo[] = [
    { id: "1", text: "주간 회의 준비", completed: false },
    { id: "2", text: "장보기", completed: false },
    { id: "3", text: "회의록 정리", completed: false },
    { id: "4", text: "운동하기", completed: false },
  ]

  it("'회의' 검색 -> 제목에 '회의'가 들어간 항목만 표시", async () => {
    seed(SEED)
    const { user, search, titles } = setup()

    await user.type(search, "회의")

    expect(titles()).toEqual(["주간 회의 준비", "회의록 정리"])
  })

  it("검색어를 지우면 -> 모든 항목이 다시 표시", async () => {
    seed(SEED)
    const { user, search, titles } = setup()
    await user.type(search, "회의")

    await user.clear(search)

    expect(titles()).toEqual([
      "주간 회의 준비",
      "장보기",
      "회의록 정리",
      "운동하기",
    ])
  })
})

describe("5. 카테고리", () => {
  it("'업무'를 골라 Todo 추가 -> 목록에 '업무' 표시", async () => {
    const { addTodo, itemOf } = setup()

    await addTodo("기획서 작성", { category: "업무" })

    expect(within(itemOf("기획서 작성")).getByText("업무")).toBeInTheDocument()
  })
})

describe("6. 카테고리별 모아 보기", () => {
  const SEED: SeedTodo[] = [
    { id: "1", text: "기획서 작성", completed: false, category: "work" },
    { id: "2", text: "운동하기", completed: false, category: "personal" },
    { id: "3", text: "우유 사기", completed: false, category: "shopping" },
    { id: "4", text: "회의 준비", completed: false, category: "work" },
    { id: "5", text: "산책", completed: false },
  ]

  it("'업무' 선택 -> 업무 항목만 표시", async () => {
    seed(SEED)
    const { user, categoryView, titles } = setup()

    await user.selectOptions(categoryView, "업무")

    expect(titles()).toEqual(["기획서 작성", "회의 준비"])
  })

  it("'전체' 선택 -> 모든 항목 표시", async () => {
    seed(SEED)
    const { user, categoryView, titles } = setup()
    await user.selectOptions(categoryView, "업무")

    await user.selectOptions(categoryView, "전체")

    expect(titles()).toEqual([
      "기획서 작성",
      "운동하기",
      "우유 사기",
      "회의 준비",
      "산책",
    ])
  })
})
