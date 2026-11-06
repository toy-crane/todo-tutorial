import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { TodoApp } from "@/components/todo-app"

function setup() {
  const user = userEvent.setup()
  const utils = render(<TodoApp />)
  const input = screen.getByRole("textbox", { name: "새 할 일" })
  const addTodo = async (text: string) => {
    await user.type(input, `${text}{Enter}`)
  }
  const itemTexts = () =>
    screen.getAllByRole("listitem").map((li) => li.textContent)
  return { user, input, addTodo, itemTexts, ...utils }
}

describe("TodoApp", () => {
  it('1. "장보기"를 입력하고 Enter를 누르면 목록 맨 위에 추가된다', async () => {
    const { input, addTodo, itemTexts } = setup()

    await addTodo("청소하기")
    await addTodo("장보기")

    expect(itemTexts()[0]).toBe("장보기")
    expect(itemTexts()).toEqual(["장보기", "청소하기"])
    expect(input).toHaveValue("")
  })

  it('2. "장보기"의 체크박스를 클릭하면 완료로 표시되고 취소선이 그어진다', async () => {
    const { user, addTodo } = setup()
    await addTodo("장보기")

    const checkbox = screen.getByRole("checkbox", { name: "장보기 완료" })
    expect(checkbox).not.toBeChecked()
    expect(screen.getByText("장보기")).not.toHaveClass("line-through")

    await user.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(screen.getByText("장보기")).toHaveClass("line-through")
  })

  it("3. 항목을 하나 더 추가하고 삭제 버튼을 누르면 그 항목만 사라진다", async () => {
    const { user, addTodo, itemTexts } = setup()
    await addTodo("장보기")
    await addTodo("운동하기")

    await user.click(screen.getByRole("button", { name: "운동하기 삭제" }))

    expect(screen.queryByText("운동하기")).not.toBeInTheDocument()
    expect(itemTexts()).toEqual(["장보기"])
  })

  it('4. "장보기"를 더블클릭해 "우유 사기"로 고치면 그 자리에서 텍스트가 바뀐다', async () => {
    const { user, addTodo, itemTexts } = setup()
    await addTodo("청소하기")
    await addTodo("장보기")
    await addTodo("운동하기")
    expect(itemTexts()).toEqual(["운동하기", "장보기", "청소하기"])

    await user.dblClick(screen.getByText("장보기"))
    const editInput = screen.getByRole("textbox", { name: "할 일 수정" })
    await user.clear(editInput)
    await user.type(editInput, "우유 사기{Enter}")

    expect(
      screen.queryByRole("textbox", { name: "할 일 수정" })
    ).not.toBeInTheDocument()
    expect(screen.queryByText("장보기")).not.toBeInTheDocument()
    expect(itemTexts()).toEqual(["운동하기", "우유 사기", "청소하기"])
  })

  it("5. 페이지를 새로고침해도 목록과 완료 표시가 그대로 남아 있다", async () => {
    const { user, addTodo, unmount } = setup()
    await addTodo("청소하기")
    await addTodo("장보기")
    await user.click(screen.getByRole("checkbox", { name: "장보기 완료" }))

    // 새로고침: 화면을 완전히 내렸다가 다시 그린다 (localStorage만 남음)
    unmount()
    render(<TodoApp />)

    const items = screen.getAllByRole("listitem")
    expect(items.map((li) => li.textContent)).toEqual(["장보기", "청소하기"])
    expect(
      within(items[0]).getByRole("checkbox", { name: "장보기 완료" })
    ).toBeChecked()
    expect(within(items[0]).getByText("장보기")).toHaveClass("line-through")
    expect(
      within(items[1]).getByRole("checkbox", { name: "청소하기 완료" })
    ).not.toBeChecked()
  })
})
