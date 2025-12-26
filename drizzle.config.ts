import { defineConfig } from "drizzle-kit";

const remoteConfig = defineConfig({
	schema: "./app/lib/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
		token: process.env.CLOUDFLARE_D1_TOKEN!,
	},
});

const localConfig = defineConfig({
	schema: "./app/lib/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/25eabb7c53441872a4a4abb47c949949922819653bd1d5148f978d7d7562a7bf.sqlite ",
	},
});

export default process.env.NODE_ENV === "development"
	? localConfig
	: remoteConfig;
