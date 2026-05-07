import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const D1_DIR = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject";

export function findLocalD1Database(): string | null {
	try {
		const files = readdirSync(D1_DIR)
			.filter((file) => file.endsWith(".sqlite") && file !== "metadata.sqlite")
			.map((file) => ({
				name: file,
				path: join(D1_DIR, file),
				time: statSync(join(D1_DIR, file)).mtime.getTime(),
			}))
			.sort((a, b) => b.time - a.time); // Sort by most recently modified

		if (files.length === 0) {
			console.error("No local D1 database found.");
			console.error("Try running your dev server first: bun run dev");
			return null;
		}

		if (files.length > 1) {
			console.warn(
				"Multiple D1 database files found. Using the most recent one.",
			);
		}

		return files[0].path;
	} catch (error) {
		console.error("Error finding local D1 database:", error);
		console.error(
			"Make sure .wrangler directory exists. Try running: bun run dev",
		);
		return null;
	}
}
