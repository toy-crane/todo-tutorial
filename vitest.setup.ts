import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// 각 테스트가 끝나면 렌더링된 DOM을 정리한다.
afterEach(() => {
  cleanup();
});
