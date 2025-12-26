import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle-do",
	schema: "./app/lib/db/schema-do.ts",
	dialect: "sqlite",
	driver: "durable-sqlite",
});
