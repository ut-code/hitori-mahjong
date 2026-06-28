import { drizzle } from "drizzle-orm/d1";

export function getDB(env: Env) {
	const db = drizzle(env.DB);
	return db;
}
