import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { TodoApp } from "@/components/todo-app"

// 완료 2개, 미완료 3개
const SEED = [
  { id: "1", text: "장보기", completed: true },
  { id: "2", text: "청소하기", completed: false },
  { id: "3", text: "운동하기", completed: true },
  { id: "4", text: "책 읽기", completed: false },
  { id: "5", text: "빨래하기", completed: false },
]

const clearButton = () =>
  screen.queryByRole("button", { name: /완료한 일 지우기/ })
const itemTexts = () =>
  screen.queryAllByRole("listitem").map((li) => li.textContent)

describe("완료한 일 지우기", () => {
  beforeEach(() => {
    window.localStorage.setItem("todos", JSON.stringify(SEED))
  })

  it("1. 버튼에 완료한 할 일 개수가 표시된다", () => {
    render(<TodoApp />)

    expect(clearButton()).toHaveTextContent("완료한 일 지우기 (2)")
  })

  it("2. 버튼을 누르면 완료한 할 일만 지워지고 저장된다", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.click(clearButton()!)

    expect(itemTexts()).toEqual(["청소하기", "책 읽기", "빨래하기"])
    const stored = JSON.parse(window.localStorage.getItem("todos")!)
    expect(stored.map((t: { id: string }) => t.id)).toEqual(["2", "4", "5"])
  })

  it("3. 완료한 할 일이 없으면 버튼이 보이지 않는다", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.click(clearButton()!)

    expect(clearButton()).not.toBeInTheDocument()
  })

  it("4. 할 일을 완료로 체크하면 버튼이 나타나고 개수가 늘어난다", async () => {
    window.localStorage.setItem(
      "todos",
      JSON.stringify(SEED.map((t) => ({ ...t, completed: false })))
    )
    const user = userEvent.setup()
    render(<TodoApp />)
    expect(clearButton()).not.toBeInTheDocument()

    await user.click(screen.getByRole("checkbox", { name: "청소하기 완료" }))

    expect(clearButton()).toHaveTextContent("완료한 일 지우기 (1)")
  })

  it("5. '완료' 필터에서 지우면 빈 목록 안내가 보인다", async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.click(screen.getByRole("tab", { name: "완료" }))

    await user.click(clearButton()!)

    expect(itemTexts()).toEqual([])
    expect(screen.getByText("해당하는 할 일이 없습니다")).toBeInTheDocument()
  })
})
