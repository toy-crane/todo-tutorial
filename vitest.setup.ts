import "@testing-library/jest-dom/vitest";

// 렌더링된 DOM 정리(cleanup)는 별도로 등록하지 않는다.
// vitest.config.ts의 globals: true로 전역 afterEach가 있으면
// @testing-library/react가 import될 때 afterEach(cleanup)을 자동으로 등록한다.
