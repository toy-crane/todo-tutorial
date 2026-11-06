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

function setup() {
  const user = userEvent.setup()
  render(<TodoApp />)
  const filter = (name: "전체" | "진행중" | "완료") =>
    screen.getByRole("button", { name })
  const itemTexts = () =>
    screen.queryAllByRole("listitem").map((li) => li.textContent)
  return { user, filter, itemTexts }
}

describe("TodoApp 필터", () => {
  beforeEach(() => {
    window.localStorage.setItem("todos", JSON.stringify(SEED))
  })

  it("1. '전체'를 선택하면 5개가 모두 보인다", async () => {
    const { user, filter, itemTexts } = setup()

    await user.click(filter("완료"))
    await user.click(filter("전체"))

    expect(filter("전체")).toHaveAttribute("aria-pressed", "true")
    expect(itemTexts()).toEqual([
      "장보기",
      "청소하기",
      "운동하기",
      "책 읽기",
      "빨래하기",
    ])
  })

  it("2. '진행중'을 선택하면 미완료 3개만 보인다", async () => {
    const { user, filter, itemTexts } = setup()

    await user.click(filter("진행중"))

    expect(filter("진행중")).toHaveAttribute("aria-pressed", "true")
    expect(itemTexts()).toEqual(["청소하기", "책 읽기", "빨래하기"])
  })

  it("3. '완료'를 선택하면 완료 2개만 보인다", async () => {
    const { user, filter, itemTexts } = setup()

    await user.click(filter("완료"))

    expect(filter("완료")).toHaveAttribute("aria-pressed", "true")
    expect(itemTexts()).toEqual(["장보기", "운동하기"])
  })

  it("4. '완료' 필터에서 항목의 체크를 풀면 그 항목이 목록에서 사라진다", async () => {
    const { user, filter, itemTexts } = setup()
    await user.click(filter("완료"))

    await user.click(screen.getByRole("checkbox", { name: "장보기 완료" }))

    expect(screen.queryByText("장보기")).not.toBeInTheDocument()
    expect(itemTexts()).toEqual(["운동하기"])
  })

  it("5. '완료' 필터에서 새 Todo를 추가하면 필터가 '전체'로 바뀌고 새 항목이 보인다", async () => {
    const { user, filter, itemTexts } = setup()
    await user.click(filter("완료"))

    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "우유 사기{Enter}"
    )

    expect(filter("전체")).toHaveAttribute("aria-pressed", "true")
    expect(filter("완료")).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByText("우유 사기")).toBeInTheDocument()
    expect(itemTexts()).toEqual([
      "우유 사기",
      "장보기",
      "청소하기",
      "운동하기",
      "책 읽기",
      "빨래하기",
    ])
  })
})
