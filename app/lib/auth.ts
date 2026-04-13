import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
// import Database from "better-sqlite3";
// import { drizzle } from "drizzle-orm/better-sqlite3";
// import { findLocalD1Database } from "../../find-local-d1";
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

// for better-auth cli
// const path = findLocalD1Database();
// if (!path) throw new Error("Cannot find local d1");
//
// export const auth = betterAuth({
// 	database: drizzleAdapter(drizzle(new Database(path), { schema }), {
// 		provider: "sqlite",
// 		schema: schema,
// 	}),
// 	plugins: [anonymous()],
// });
