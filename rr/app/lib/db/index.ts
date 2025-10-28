import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

export function getDB(env: Env) {
	const db =
		env.NODE_ENV === "development"
			? drizzlePg(env.DATABASE_URL)
			: drizzleNeon(env.DATABASE_URL);
	return db;
}
