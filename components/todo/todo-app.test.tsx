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

  it("우선순위 미선택 시 기본값 \"보통\"으로 추가된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.type(
      screen.getByPlaceholderText(PLACEHOLDER),
      "기본 우선순위{Enter}",
    );

    const item = screen.getByRole("listitem");
    expect(within(item).getByLabelText("우선순위 보통")).toHaveTextContent(
      "보통",
    );
  });

  it('"높음" 선택 후 추가하면 항목에 "높음" 배지가 표시된다', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByRole("radio", { name: "높음" }));
    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "긴급 보고{Enter}");

    const item = screen.getByRole("listitem");
    expect(within(item).getByText("긴급 보고")).toBeInTheDocument();
    expect(within(item).getByLabelText("우선순위 높음")).toHaveTextContent(
      "높음",
    );
  });

  it("서로 다른 우선순위로 추가한 항목들이 각자 자신의 배지를 가진다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText(PLACEHOLDER);

    await user.click(screen.getByRole("radio", { name: "높음" }));
    await user.type(input, "긴급{Enter}");

    await user.click(screen.getByRole("radio", { name: "낮음" }));
    await user.type(input, "여유{Enter}");

    const items = screen.getAllByRole("listitem");
    const urgent = items.find((i) => within(i).queryByText("긴급"))!;
    const lazy = items.find((i) => within(i).queryByText("여유"))!;

    expect(within(urgent).getByLabelText("우선순위 높음")).toBeInTheDocument();
    expect(within(lazy).getByLabelText("우선순위 낮음")).toBeInTheDocument();
  });

  it("새로고침(재마운트) 후에도 우선순위가 유지된다", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TodoApp />);

    await user.click(screen.getByRole("radio", { name: "높음" }));
    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "기획안{Enter}");

    unmount();
    render(<TodoApp />);

    const item = await screen.findByRole("listitem");
    expect(within(item).getByText("기획안")).toBeInTheDocument();
    expect(within(item).getByLabelText("우선순위 높음")).toBeInTheDocument();
  });
});
