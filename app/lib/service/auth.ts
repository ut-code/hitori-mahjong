import { env } from "cloudflare:workers";
import { getRequest } from "@tanstack/solid-start/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { getDB } from "@/lib/service/db";
import * as schema from "@/lib/service/db/schema";

export function getAuth() {
	const auth = betterAuth({
		baseURL: env.BETTER_AUTH_URL,
		database: drizzleAdapter(getDB(), {
			provider: "sqlite",
			schema: schema,
		}),
		plugins: [anonymous()],
	});
	return auth;
}

export async function getSessionUserId(): Promise<string | null> {
	const session = await getAuth().api.getSession({
		headers: getRequest().headers,
	});
	return session?.user.id ?? null;
}
