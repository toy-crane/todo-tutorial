import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoApp } from "./todo-app";

const PLACEHOLDER = "할 일을 입력하고 Enter 를 누르세요";

beforeEach(() => {
  localStorage.clear();
});

describe("TodoApp", () => {
  it('"장보기" 입력 후 Enter 를 누르면 목록에 추가된다', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText(PLACEHOLDER);
    await user.type(input, "장보기{Enter}");

    const list = screen.getByRole("list");
    expect(within(list).getByText("장보기")).toBeInTheDocument();
  });

  it("빈 입력 상태에서 Enter 를 눌러도 Todo 가 추가되지 않는다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText(PLACEHOLDER);
    await user.click(input);
    await user.keyboard("{Enter}");

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByText("할 일을 추가해보세요")).toBeInTheDocument();
  });

  it("체크박스를 클릭하면 완료 표시(취소선)가 적용된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "운동{Enter}");

    const text = screen.getByText("운동");
    expect(text).not.toHaveClass("line-through");

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(text).toHaveClass("line-through");
  });

  it("삭제 버튼을 클릭하면 해당 항목이 제거된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText(PLACEHOLDER);
    await user.type(input, "책 읽기{Enter}");
    await user.type(input, "산책{Enter}");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);

    const targetItem = items.find((item) =>
      within(item).queryByText("책 읽기"),
    )!;
    const deleteButton = within(targetItem).getByRole("button");
    await user.click(deleteButton);

    expect(screen.queryByText("책 읽기")).not.toBeInTheDocument();
    expect(screen.getByText("산책")).toBeInTheDocument();
  });

  it("페이지 새로고침(재마운트) 후에도 기존 목록이 유지된다", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TodoApp />);

    await user.type(
      screen.getByPlaceholderText(PLACEHOLDER),
      "이메일 회신{Enter}",
    );
    expect(screen.getByText("이메일 회신")).toBeInTheDocument();

    unmount();
    render(<TodoApp />);

    expect(await screen.findByText("이메일 회신")).toBeInTheDocument();
  });
});
