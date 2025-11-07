import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.js"],
    maxThreads: 1,
    minThreads: 1,
    hookTimeout: 20000,
  },
});

