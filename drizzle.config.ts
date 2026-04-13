import { readdirSync } from "node:fs";
import path from "node:path";
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

function findLocalD1Path(): string {
	const wranglerDir = path.resolve(".wrangler/state/v3/d1");
	try {
		const files = readdirSync(wranglerDir).filter((f) => f.endsWith(".sqlite"));
		if (files.length === 0) {
			throw new Error(
				"No local D1 database found. Run `npm run dev` first to create one.",
			);
		}
		return path.join(wranglerDir, files[0]);
	} catch {
		throw new Error(
			`Local D1 directory not found at ${wranglerDir}. Run \`npm run dev\` first.`,
		);
	}
}

const localConfig = defineConfig({
	schema: "./app/lib/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: findLocalD1Path(),
	},
});

export default process.env.NODE_ENV === "development"
	? localConfig
	: remoteConfig;
