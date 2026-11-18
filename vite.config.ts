import { cloudflare } from "@cloudflare/vite-plugin";
import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  // テストは純粋関数だけを対象にしており、Workers ランタイムを立ち上げる Cloudflare などのプラグインは
  // Vitest の下では起動に失敗するため、テスト時は読み込まない
  plugins: process.env.VITEST
    ? []
    : [
        cloudflare({ viteEnvironment: { name: "ssr" } }),
        tailwindcss(),
        // 既存のコードを app/ に置いているため、TanStack Start の既定の src/ ではなく app/ を見させる
        tanstackStart({ srcDirectory: "app" }),
        solid({ ssr: true }),
      ],
  test: {
    include: ["app/**/*.test.ts"],
  },
  fmt: {
    // 生成物はツールが書き戻すため、整形しても次の生成で差分が戻る
    ignorePatterns: ["app/routeTree.gen.ts", "worker-configuration.d.ts"],
  },
  lint: {
    ignorePatterns: ["app/routeTree.gen.ts", "worker-configuration.d.ts"],
  },
  staged: {
    "*": "vp check --fix",
  },
});
