import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { getDB } from "@/db";
import * as schema from "@/db/schema";

export function getAuth(env: Env) {
	const auth = betterAuth({
		baseURL: env.BETTER_AUTH_URL,
		database: drizzleAdapter(getDB(env), {
			provider: "sqlite",
			schema: schema,
		}),
		plugins: [anonymous()],
	});
	return auth;
}
