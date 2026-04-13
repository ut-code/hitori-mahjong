import { defineConfig } from "drizzle-kit";

const localConfig = defineConfig({
	schema: "./app/lib/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: "./local.db",
	},
});

export default localConfig;
