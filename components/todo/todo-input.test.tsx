import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoInput } from "./todo-input";

const PLACEHOLDER = "할 일을 입력하고 Enter 를 누르세요";

describe("TodoInput", () => {
  it("입력 후 Enter 키를 누르면 onAdd 가 호출되고 입력값이 초기화된다", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();

    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText(PLACEHOLDER) as HTMLInputElement;

    await user.type(input, "장보기{Enter}");

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith("장보기", "normal", undefined);
    expect(input.value).toBe("");
  });

  it("기본 선택된 우선순위는 \"보통\"이다", () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "보통" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "높음" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: "낮음" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("우선순위 옵션을 클릭하면 active 상태가 바뀐다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: "높음" }));

    expect(screen.getByRole("radio", { name: "높음" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "보통" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("선택한 우선순위가 onAdd 의 두 번째 인자로 전달된다", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();

    render(<TodoInput onAdd={onAdd} />);

    await user.click(screen.getByRole("radio", { name: "높음" }));
    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "긴급 보고{Enter}");

    expect(onAdd).toHaveBeenCalledWith("긴급 보고", "high", undefined);
  });

  it("DatePicker 로 마감일을 선택하면 트리거에 ISO 형식 날짜가 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "마감일 선택" }));
    await user.click(screen.getByText("15", { selector: "button" }));

    expect(
      screen.getByRole("button", { name: "마감일 선택" }),
    ).toHaveTextContent(/^\d{4}-\d{2}-15$/);
  });

  it("마감일 선택 후 Enter 누르면 onAdd 의 세 번째 인자로 dueDate(number) 가 전달된다", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();

    render(<TodoInput onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "마감일 선택" }));
    await user.click(screen.getByText("15", { selector: "button" }));
    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "회의{Enter}");

    expect(onAdd).toHaveBeenCalledWith("회의", "normal", expect.any(Number));
    const calledMs = onAdd.mock.calls[0][2] as number;
    expect(new Date(calledMs).getDate()).toBe(15);
  });
});
