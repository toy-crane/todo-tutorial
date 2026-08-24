import type { Todo } from "@/lib/types";
import { matchesSearch, sortTodos } from "@/lib/todo-utils";

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "1",
    text: "할 일",
    completed: false,
    priority: "medium",
    createdAt: 0,
    ...overrides,
  };
}

describe("sortTodos", () => {
  it("'created'는 생성 시각 내림차순(최신순)으로 정렬한다", () => {
    const todos = [
      makeTodo({ id: "a", createdAt: 1 }),
      makeTodo({ id: "b", createdAt: 3 }),
      makeTodo({ id: "c", createdAt: 2 }),
    ];

    expect(sortTodos(todos, "created").map((t) => t.id)).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  it("'name'은 제목 가나다순(오름차순)으로 정렬한다", () => {
    const todos = [
      makeTodo({ id: "a", text: "사과" }),
      makeTodo({ id: "b", text: "가지" }),
      makeTodo({ id: "c", text: "바나나" }),
    ];

    expect(sortTodos(todos, "name").map((t) => t.id)).toEqual(["b", "c", "a"]);
  });

  it("'due'는 마감일이 가까운 순(오름차순)으로 정렬한다", () => {
    const todos = [
      makeTodo({ id: "a", dueDate: "2026-07-10" }),
      makeTodo({ id: "b", dueDate: "2026-07-01" }),
      makeTodo({ id: "c", dueDate: "2026-07-05" }),
    ];

    expect(sortTodos(todos, "due").map((t) => t.id)).toEqual(["b", "c", "a"]);
  });

  it("'due'에서 마감일이 없는 항목은 맨 뒤로 보낸다", () => {
    const todos = [
      makeTodo({ id: "a" }),
      makeTodo({ id: "b", dueDate: "2026-07-05" }),
      makeTodo({ id: "c" }),
      makeTodo({ id: "d", dueDate: "2026-07-01" }),
    ];

    const ids = sortTodos(todos, "due").map((t) => t.id);
    // 마감일 있는 항목이 가까운 순으로 먼저
    expect(ids.slice(0, 2)).toEqual(["d", "b"]);
    // 마감일 없는 항목은 뒤로(원래 순서 유지)
    expect(ids.slice(2)).toEqual(["a", "c"]);
  });

  it("원본 배열을 변경하지 않는다", () => {
    const todos = [
      makeTodo({ id: "a", createdAt: 1 }),
      makeTodo({ id: "b", createdAt: 2 }),
    ];
    const snapshot = todos.map((t) => t.id);

    sortTodos(todos, "created");

    expect(todos.map((t) => t.id)).toEqual(snapshot);
  });
});

describe("matchesSearch", () => {
  it("제목에 검색어가 포함되면 true", () => {
    expect(matchesSearch(makeTodo({ text: "팀 회의 준비" }), "회의")).toBe(true);
  });

  it("제목에 검색어가 없으면 false", () => {
    expect(matchesSearch(makeTodo({ text: "장보기" }), "회의")).toBe(false);
  });

  it("대소문자를 구분하지 않는다", () => {
    expect(matchesSearch(makeTodo({ text: "Daily Standup" }), "standup")).toBe(
      true
    );
  });

  it("빈 검색어(공백 포함)는 모든 항목을 통과시킨다", () => {
    expect(matchesSearch(makeTodo({ text: "장보기" }), "   ")).toBe(true);
    expect(matchesSearch(makeTodo({ text: "장보기" }), "")).toBe(true);
  });
});
