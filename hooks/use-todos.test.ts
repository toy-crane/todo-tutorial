import { act, renderHook, waitFor } from "@testing-library/react";
import { useTodos } from "@/hooks/use-todos";

beforeEach(() => {
  localStorage.clear();
});

describe("useTodos 우선순위", () => {
  it("addTodo에 전달한 우선순위로 추가한다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("장보기", "high");
    });

    expect(result.current.todos[0]).toMatchObject({
      text: "장보기",
      priority: "high",
      completed: false,
    });
  });

  it("우선순위를 생략하면 기본값(medium)으로 추가한다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("청소");
    });

    expect(result.current.todos[0].priority).toBe("medium");
  });

  it("priority가 없는 기존 저장 데이터는 medium으로 보정해 로드한다", async () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([{ id: "1", text: "구버전 할 일", completed: false }])
    );

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].priority).toBe("medium");
  });

  it("추가한 우선순위를 localStorage에 저장한다", async () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("장보기", "low");
    });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("todos") ?? "[]");
      expect(stored[0]?.priority).toBe("low");
    });
  });
});

describe("useTodos 마감일", () => {
  it("addTodo에 전달한 마감일로 추가한다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("회의", "medium", "2026-07-01");
    });

    expect(result.current.todos[0]).toMatchObject({
      text: "회의",
      dueDate: "2026-07-01",
    });
  });

  it("마감일을 생략하면 dueDate 없이 추가한다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("청소");
    });

    expect(result.current.todos[0].dueDate).toBeUndefined();
  });

  it("새로 추가한 Todo에는 생성 시각(createdAt)이 기록된다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("회의");
    });

    expect(typeof result.current.todos[0].createdAt).toBe("number");
  });

  it("createdAt이 없는 기존 데이터는 number로 보정해 로드한다", async () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([
        { id: "1", text: "구버전 할 일", completed: false, priority: "medium" },
      ])
    );

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(typeof result.current.todos[0].createdAt).toBe("number");
  });
});

describe("useTodos 카테고리", () => {
  it("addTodo에 전달한 카테고리로 추가한다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("보고서", "medium", undefined, "work");
    });

    expect(result.current.todos[0].category).toBe("work");
  });

  it("카테고리를 생략하면 category 없이 추가한다", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("청소");
    });

    expect(result.current.todos[0].category).toBeUndefined();
  });
});

describe("useTodos 손상 데이터 보호", () => {
  it("파싱할 수 없는 저장값을 빈 배열로 덮어쓰지 않는다", async () => {
    localStorage.setItem("todos", "{이건 JSON이 아님");

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.todos).toEqual([]);
    // 손상된 원본이 보존돼 복구 여지가 남아야 한다
    expect(localStorage.getItem("todos")).toBe("{이건 JSON이 아님");
  });

  it("배열이 아닌 저장값도 덮어쓰지 않는다", async () => {
    localStorage.setItem("todos", JSON.stringify({ x: 1 }));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.todos).toEqual([]);
    expect(localStorage.getItem("todos")).toBe('{"x":1}');
  });

  it("손상 데이터 로드 후 새 항목을 추가하면 정상적으로 저장된다", async () => {
    localStorage.setItem("todos", "{이건 JSON이 아님");

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    act(() => {
      result.current.addTodo("새 할 일");
    });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("todos") ?? "null");
      expect(Array.isArray(stored)).toBe(true);
      expect(stored[0]?.text).toBe("새 할 일");
    });
  });
});

describe("useTodos 여러 탭 동기화", () => {
  // 다른 탭이 localStorage를 바꾼 상황을 흉내 낸다.
  // 실제 브라우저는 값을 바꾼 탭이 아닌 다른 탭에만 storage 이벤트를 보낸다.
  function writeFromOtherTab(value: unknown) {
    const newValue = JSON.stringify(value);
    localStorage.setItem("todos", newValue);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "todos",
        newValue,
        storageArea: localStorage,
      })
    );
  }

  it("다른 탭에서 추가한 항목을 현재 탭 상태에 반영한다", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    act(() => {
      writeFromOtherTab([
        { id: "b", text: "탭 B 할 일", completed: false, priority: "low", createdAt: 1 },
      ]);
    });

    expect(result.current.todos.map((t) => t.text)).toEqual(["탭 B 할 일"]);
  });

  it("다른 탭의 항목을 반영한 뒤 현재 탭에서 추가해도 그 항목이 지워지지 않는다", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    act(() => {
      writeFromOtherTab([
        { id: "b", text: "탭 B 할 일", completed: false, priority: "low", createdAt: 1 },
      ]);
    });
    act(() => {
      result.current.addTodo("탭 A 할 일");
    });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("todos") ?? "[]");
      expect(stored.map((t: { text: string }) => t.text)).toEqual([
        "탭 A 할 일",
        "탭 B 할 일",
      ]);
    });
  });

  it("다른 탭에서 받은 값은 다시 저장하지 않는다", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    act(() => {
      writeFromOtherTab([
        { id: "b", text: "탭 B 할 일", completed: false, priority: "low", createdAt: 1 },
      ]);
    });

    await waitFor(() => expect(result.current.todos).toHaveLength(1));
    // writeFromOtherTab이 직접 호출한 1회만 있어야 한다
    expect(setItem).toHaveBeenCalledTimes(1);
    setItem.mockRestore();
  });

  it("다른 탭의 옛 데이터도 priority/createdAt 기본값으로 보정한다", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    act(() => {
      writeFromOtherTab([{ id: "b", text: "구버전", completed: false }]);
    });

    expect(result.current.todos[0].priority).toBe("medium");
    expect(typeof result.current.todos[0].createdAt).toBe("number");
  });

  it("다른 탭이 손상된 값을 쓰면 현재 상태를 유지한다", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => {
      result.current.addTodo("기존 할 일");
    });

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "todos",
          newValue: "{손상",
          storageArea: localStorage,
        })
      );
    });

    expect(result.current.todos.map((t) => t.text)).toEqual(["기존 할 일"]);
  });
});
