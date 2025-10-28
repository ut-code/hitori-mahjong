import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import type { Route } from "./+types/api.auth.$";

export async function loader({ request, context }: Route.LoaderArgs) {
	const { env } = context.cloudflare;
	const db =
		env.NODE_ENV === "development"
			? drizzlePg(env.DATABASE_URL)
			: drizzleNeon(env.DATABASE_URL);
	const auth = betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
		emailAndPassword: {
			enabled: true,
		},
	});
	return auth.handler(request);
}
