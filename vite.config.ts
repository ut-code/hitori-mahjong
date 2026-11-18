import { cloudflare } from "@cloudflare/vite-plugin";
import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		// 既存のコードを app/ に置いているため、TanStack Start の既定の src/ ではなく app/ を見させる
		tanstackStart({ srcDirectory: "app" }),
		solid({ ssr: true }),
	],
});
