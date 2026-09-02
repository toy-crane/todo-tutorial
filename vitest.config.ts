import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // tsconfig.json의 "@/*" 경로 alias를 네이티브로 해석한다.
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    // Node의 실험적 Web Storage 전역(localStorage)이 jsdom 구현을 가리는 것을 방지한다.
    // https://github.com/nodejs/node/pull/61333, https://github.com/vitest-dev/vitest/issues/8757
    execArgv: ["--no-experimental-webstorage"],
  },
});
