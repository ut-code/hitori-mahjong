import { defineConfig } from "drizzle-kit";
import { findLocalD1Path } from "./app/lib/db";

const localConfig = defineConfig({
	schema: "./app/lib/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: findLocalD1Path(),
	},
});

export default localConfig;
