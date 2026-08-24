import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoCategoryFilter } from "@/components/todo-category-filter";

describe("TodoCategoryFilter", () => {
  it("전체/업무/개인/쇼핑 옵션을 렌더링한다", () => {
    render(<TodoCategoryFilter value="all" onChange={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "전체" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "업무" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "개인" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "쇼핑" })).toBeInTheDocument();
  });

  it("현재 값만 선택 상태로 표시된다", () => {
    render(<TodoCategoryFilter value="work" onChange={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "업무" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "전체" })).not.toBeChecked();
  });

  it("옵션을 클릭하면 해당 값으로 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TodoCategoryFilter value="all" onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: "업무" }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith("work");
  });
});
