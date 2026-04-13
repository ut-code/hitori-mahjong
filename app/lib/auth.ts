import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import * as schema from "../lib/db/schema";
import { getDB } from "./db";

export function getAuth(env: Env) {
	const auth = betterAuth({
		database: drizzleAdapter(getDB(env), {
			provider: "sqlite",
			schema: schema,
		}),
		plugins: [anonymous()],
	});
	return auth;
}

// better-auth cli needs the following auth instance
// Uncomment when running auth CLI
// import Database from "better-sqlite3";
// import { drizzle } from "drizzle-orm/better-sqlite3";
// import { findLocalD1Path } from "./db";
//
// export const auth = betterAuth({
// 	database: drizzleAdapter(drizzle(new Database(findLocalD1Path())), {
// 		provider: "sqlite",
// 		schema: schema,
// 	}),
// 	plugins: [anonymous()],
// });
