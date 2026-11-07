import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { TodoApp } from "@/components/todo-app"

// 완료 2개, 미완료 2개
const SEED = [
  { id: "1", text: "장보기", completed: true },
  { id: "2", text: "청소하기", completed: false },
  { id: "3", text: "운동하기", completed: true },
  { id: "4", text: "책 읽기", completed: false },
]

function setup(seed = SEED) {
  window.localStorage.setItem("todos", JSON.stringify(seed))
  const user = userEvent.setup()
  render(<TodoApp />)
  const clearButton = () =>
    screen.getByRole("button", { name: /완료 항목 지우기/ })
  const itemTexts = () =>
    screen.queryAllByRole("listitem").map((li) => li.textContent)
  return { user, clearButton, itemTexts }
}

describe("TodoApp 완료 항목 일괄 삭제", () => {
  it("1. 버튼을 누르면 완료한 할 일만 모두 사라진다", async () => {
    const { user, clearButton, itemTexts } = setup()

    await user.click(clearButton())

    expect(itemTexts()).toEqual(["청소하기", "책 읽기"])
  })

  it("2. 지운 결과가 저장되어 새로고침 후에도 유지된다", async () => {
    const { user, clearButton } = setup()

    await user.click(clearButton())

    const stored = JSON.parse(window.localStorage.getItem("todos") ?? "[]")
    expect(stored.map((t: { text: string }) => t.text)).toEqual([
      "청소하기",
      "책 읽기",
    ])
  })

  it("3. 버튼에 완료한 할 일 개수가 표시된다", () => {
    const { clearButton } = setup()

    expect(clearButton()).toHaveTextContent("완료 항목 지우기 (2)")
  })

  it("4. 완료한 할 일이 없으면 버튼이 비활성화된다", () => {
    const { clearButton } = setup([
      { id: "1", text: "청소하기", completed: false },
    ])

    expect(clearButton()).toBeDisabled()
  })

  it("5. 필터·검색으로 가려진 완료 항목도 함께 지워진다", async () => {
    const { user, clearButton, itemTexts } = setup()
    await user.click(screen.getByRole("button", { name: "진행중" }))

    await user.click(clearButton())
    await user.click(screen.getByRole("button", { name: "전체" }))

    expect(itemTexts()).toEqual(["청소하기", "책 읽기"])
  })
})
