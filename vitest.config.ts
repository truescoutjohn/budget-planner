import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv("test", process.cwd(), "");

  return {
    plugins: [react()],
    test: {
      environment: "jsdom",
      env: {
        ...env,
        DATABASE_URL: env.DATABASE_URL,
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  };
});
