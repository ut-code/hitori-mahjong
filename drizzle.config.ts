import { defineConfig } from "drizzle-kit";
import { findLocalD1Database } from "./find-local-d1";

const path = findLocalD1Database();
if (!path) throw new Error("Local D1 database not found");

const localConfig = defineConfig({
	schema: "./app/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: path,
	},
});

export default localConfig;
