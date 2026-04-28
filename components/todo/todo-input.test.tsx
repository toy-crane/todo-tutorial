import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoInput } from "./todo-input";

describe("TodoInput", () => {
  it("입력 후 Enter 키를 누르면 onAdd 가 호출되고 입력값이 초기화된다", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();

    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText(
      "할 일을 입력하고 Enter 를 누르세요",
    ) as HTMLInputElement;

    await user.type(input, "장보기{Enter}");

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith("장보기");
    expect(input.value).toBe("");
  });
});
