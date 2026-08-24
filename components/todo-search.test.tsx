import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoSearch } from "@/components/todo-search";

describe("TodoSearch", () => {
  it("검색 입력을 렌더링한다", () => {
    render(<TodoSearch value="" onChange={vi.fn()} />);

    expect(screen.getByRole("searchbox", { name: "검색" })).toBeInTheDocument();
  });

  it("입력하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TodoSearch value="" onChange={onChange} />);

    await user.type(screen.getByRole("searchbox", { name: "검색" }), "회");

    expect(onChange).toHaveBeenCalled();
  });
});
