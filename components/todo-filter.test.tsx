import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoFilter } from "@/components/todo-filter";

describe("TodoFilter", () => {
  it("전체/진행중/완료 세 개의 필터를 렌더링한다", () => {
    render(<TodoFilter value="all" onChange={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "전체" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "진행중" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "완료" })).toBeInTheDocument();
  });

  it("현재 필터 버튼만 active(선택) 상태로 구분된다", () => {
    render(<TodoFilter value="completed" onChange={vi.fn()} />);

    const completed = screen.getByRole("radio", { name: "완료" });
    const all = screen.getByRole("radio", { name: "전체" });

    // 선택된 버튼은 checked + active(default) 스타일
    expect(completed).toBeChecked();
    expect(completed).toHaveAttribute("data-variant", "default");
    // 선택되지 않은 버튼은 unchecked + outline 스타일
    expect(all).not.toBeChecked();
    expect(all).toHaveAttribute("data-variant", "outline");
  });

  it("필터를 클릭하면 해당 값으로 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TodoFilter value="all" onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: "진행중" }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith("active");
  });
});
