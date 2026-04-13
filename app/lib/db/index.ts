import { readdirSync } from "node:fs";
import path from "node:path";
import { drizzle } from "drizzle-orm/d1";

export function getDB(env: Env) {
	const db = drizzle(env.DB);
	return db;
}

export function findLocalD1Path(): string {
	const wranglerDir = path.resolve(".wrangler/state/v3/d1");
	try {
		const files = readdirSync(wranglerDir, { recursive: true }).filter(
			(f) => typeof f === "string" && f.endsWith(".sqlite"),
		);
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
