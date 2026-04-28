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

    const item = screen.getByRole("listitem");
    const checkbox = within(item).getByRole("checkbox");
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

describe("TodoApp 필터링", () => {
  async function seedFiveTodos(user: ReturnType<typeof userEvent.setup>) {
    const input = screen.getByPlaceholderText(PLACEHOLDER);
    await user.type(input, "할일1{Enter}");
    await user.type(input, "할일2{Enter}");
    await user.type(input, "할일3{Enter}");
    await user.type(input, "할일4{Enter}");
    await user.type(input, "할일5{Enter}");

    const items = screen.getAllByRole("listitem");
    const target1 = items.find((i) => within(i).queryByText("할일1"))!;
    const target2 = items.find((i) => within(i).queryByText("할일2"))!;
    await user.click(within(target1).getByRole("checkbox"));
    await user.click(within(target2).getByRole("checkbox"));
  }

  it("'전체' 필터 선택 시 5개(완료2 + 미완료3) 모두 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await seedFiveTodos(user);
    await user.click(screen.getByRole("button", { name: "전체" }));

    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("'진행중' 필터 선택 시 미완료 3개만 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await seedFiveTodos(user);
    await user.click(screen.getByRole("button", { name: "진행중" }));

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    items.forEach((item) => {
      expect(within(item).getByRole("checkbox")).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });
  });

  it("'완료' 필터 선택 시 완료 2개만 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await seedFiveTodos(user);
    await user.click(screen.getByRole("button", { name: "완료" }));

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    items.forEach((item) => {
      expect(within(item).getByRole("checkbox")).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
  });

  it("Todo 0개 상태에서 '진행중' 선택 시 '할 일이 없습니다' 메시지가 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByRole("button", { name: "진행중" }));

    expect(screen.getByText("할 일이 없습니다")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("'완료' 필터 선택 중 항목을 미완료로 변경하면 목록에서 사라진다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await seedFiveTodos(user);
    await user.click(screen.getByRole("button", { name: "완료" }));

    const completedItems = screen.getAllByRole("listitem");
    expect(completedItems).toHaveLength(2);

    const target = completedItems.find((i) => within(i).queryByText("할일1"))!;
    await user.click(within(target).getByRole("checkbox"));

    expect(screen.queryByText("할일1")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("현재 선택된 필터 버튼만 aria-pressed=true 로 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "진행중" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "완료" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await user.click(screen.getByRole("button", { name: "진행중" }));

    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "진행중" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("TodoApp 마감일", () => {
  it("마감일 없이 추가하면 항목에 마감일 표시가 없다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "산책{Enter}");

    const item = screen.getByRole("listitem");
    expect(within(item).queryByLabelText(/^마감일/)).not.toBeInTheDocument();
  });

  it("DatePicker 로 마감일을 지정해 추가하면 항목에 마감일이 ISO 형식으로 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByRole("button", { name: "마감일 선택" }));
    await user.click(screen.getByText("15", { selector: "button" }));
    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "회의{Enter}");

    const item = screen.getByRole("listitem");
    const dueBadge = within(item).getByLabelText(/^마감일 \d{4}-\d{2}-15$/);
    expect(dueBadge).toBeInTheDocument();
  });

  it("새로고침(재마운트) 후에도 마감일이 유지된다", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TodoApp />);

    await user.click(screen.getByRole("button", { name: "마감일 선택" }));
    await user.click(screen.getByText("15", { selector: "button" }));
    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "기획안{Enter}");

    unmount();
    render(<TodoApp />);

    const item = await screen.findByRole("listitem");
    expect(
      within(item).getByLabelText(/^마감일 \d{4}-\d{2}-15$/),
    ).toBeInTheDocument();
  });
});

describe("TodoApp 정렬", () => {
  async function seedFive(user: ReturnType<typeof userEvent.setup>) {
    const input = screen.getByPlaceholderText(PLACEHOLDER);
    await user.type(input, "다라마{Enter}");
    await user.type(input, "가나{Enter}");
    await user.type(input, "마바{Enter}");
    await user.type(input, "라마바{Enter}");
    await user.type(input, "나다{Enter}");
  }

  it('"이름순" 선택 시 항목이 가나다순으로 정렬된다', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await seedFive(user);
    await user.click(screen.getByRole("button", { name: "이름순" }));

    const texts = screen
      .getAllByRole("listitem")
      .map((i) => i.textContent ?? "");
    expect(texts[0]).toContain("가나");
    expect(texts[1]).toContain("나다");
    expect(texts[2]).toContain("다라마");
    expect(texts[3]).toContain("라마바");
    expect(texts[4]).toContain("마바");
  });

  it('"생성일순" 선택 시 최신 추가된 항목이 가장 위에 온다', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await seedFive(user);
    await user.click(screen.getByRole("button", { name: "이름순" }));
    await user.click(screen.getByRole("button", { name: "생성일순" }));

    const texts = screen
      .getAllByRole("listitem")
      .map((i) => i.textContent ?? "");
    expect(texts[0]).toContain("나다");
    expect(texts[4]).toContain("다라마");
  });

  it('정렬을 선택하면 active/completed 필터가 "전체" 로 리셋된다 (단일 모드)', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByRole("button", { name: "진행중" }));
    expect(screen.getByRole("button", { name: "진행중" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "이름순" }));

    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "진행중" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "이름순" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it('"마감일순" 선택 시 가까운 마감일부터 표시되고, 마감일 없는 항목은 맨 뒤로 간다', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText(PLACEHOLDER);

    await user.type(input, "노데드1{Enter}");
    await user.type(input, "노데드2{Enter}");

    await user.click(screen.getByRole("button", { name: "마감일 선택" }));
    await user.click(screen.getByText("20", { selector: "button" }));
    await user.type(input, "마감20{Enter}");

    await user.click(screen.getByRole("button", { name: "마감일 선택" }));
    await user.click(screen.getByText("10", { selector: "button" }));
    await user.type(input, "마감10{Enter}");

    await user.click(screen.getByRole("button", { name: "마감일 선택" }));
    await user.click(screen.getByText("15", { selector: "button" }));
    await user.type(input, "마감15{Enter}");

    await user.click(screen.getByRole("button", { name: "마감일순" }));

    const texts = screen
      .getAllByRole("listitem")
      .map((i) => i.textContent ?? "");
    expect(texts[0]).toContain("마감10");
    expect(texts[1]).toContain("마감15");
    expect(texts[2]).toContain("마감20");
    expect(texts[3]).toMatch(/노데드[12]/);
    expect(texts[4]).toMatch(/노데드[12]/);
  });

  it('필터를 선택하면 정렬이 "생성일순" 으로 리셋된다 (단일 모드)', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByRole("button", { name: "이름순" }));
    expect(screen.getByRole("button", { name: "이름순" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "진행중" }));

    expect(screen.getByRole("button", { name: "생성일순" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "이름순" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

describe("TodoApp 검색", () => {
  it("검색어 입력 시 제목 부분 일치 항목만 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText(PLACEHOLDER);
    await user.type(input, "월간 회의{Enter}");
    await user.type(input, "장보기{Enter}");
    await user.type(input, "주간 회의{Enter}");
    await user.type(input, "운동{Enter}");

    const search = screen.getByRole("searchbox", { name: "검색" });
    await user.type(search, "회의");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    items.forEach((item) => {
      expect(item).toHaveTextContent(/회의/);
    });
  });

  it("검색어를 지우면 전체 목록이 복원된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText(PLACEHOLDER);
    await user.type(input, "월간 회의{Enter}");
    await user.type(input, "장보기{Enter}");
    await user.type(input, "주간 회의{Enter}");

    const search = screen.getByRole("searchbox", { name: "검색" });
    await user.type(search, "회의");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    await user.clear(search);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

});

describe("TodoApp 카테고리", () => {
  it("카테고리 선택 후 추가하면 항목에 카테고리 배지가 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByRole("checkbox", { name: "업무" }));
    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "기획안{Enter}");

    const item = screen.getByRole("listitem");
    expect(within(item).getByLabelText("카테고리 업무")).toHaveTextContent(
      "업무",
    );
  });

  it("여러 카테고리를 선택하면 모든 배지가 표시된다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByRole("checkbox", { name: "업무" }));
    await user.click(screen.getByRole("checkbox", { name: "쇼핑" }));
    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "경비 정리{Enter}");

    const item = screen.getByRole("listitem");
    expect(within(item).getByLabelText("카테고리 업무")).toBeInTheDocument();
    expect(within(item).getByLabelText("카테고리 쇼핑")).toBeInTheDocument();
  });

  it("카테고리 미선택 시 배지가 표시되지 않는다", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "산책{Enter}");

    const item = screen.getByRole("listitem");
    expect(within(item).queryByLabelText(/^카테고리/)).not.toBeInTheDocument();
  });

  it("새로고침(재마운트) 후에도 카테고리가 유지된다", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TodoApp />);

    await user.click(screen.getByRole("checkbox", { name: "개인" }));
    await user.type(screen.getByPlaceholderText(PLACEHOLDER), "운동{Enter}");

    unmount();
    render(<TodoApp />);

    const item = await screen.findByRole("listitem");
    expect(within(item).getByLabelText("카테고리 개인")).toBeInTheDocument();
  });
});

describe("TodoApp 검색-정렬 조합", () => {
  it("검색은 정렬과 조합 가능하다 (검색은 단일 모드에서 제외)", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText(PLACEHOLDER);
    await user.type(input, "다 회의{Enter}");
    await user.type(input, "장보기{Enter}");
    await user.type(input, "가 회의{Enter}");
    await user.type(input, "나 회의{Enter}");

    await user.click(screen.getByRole("button", { name: "이름순" }));

    const search = screen.getByRole("searchbox", { name: "검색" });
    await user.type(search, "회의");

    const texts = screen
      .getAllByRole("listitem")
      .map((i) => i.textContent ?? "");
    expect(texts).toHaveLength(3);
    expect(texts[0]).toContain("가 회의");
    expect(texts[1]).toContain("나 회의");
    expect(texts[2]).toContain("다 회의");

    expect(screen.getByRole("button", { name: "이름순" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
