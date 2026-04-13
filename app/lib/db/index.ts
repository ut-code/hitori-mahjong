import { drizzle } from "drizzle-orm/d1";

export function getDB(env: Env) {
	const db = drizzle(env.DB);
	return db;
}

export function findLocalD1Path(): string {
	throw new Error("findLocalD1Path is only available in a Node CLI context.");
}
