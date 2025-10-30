import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { getDB } from "./db";

export function getAuth(env?: Env) {
	const auth = betterAuth({
		database: drizzleAdapter(getDB(env), {
			provider: "pg",
		}),
		emailAndPassword: {
			enabled: true,
		},
		plugins: [
			anonymous({
				onLinkAccount: async ({ anonymousUser, newUser }) => {
					const db = getDB(env);
					// migrate like this
					// await db
					//   .update(playHistory)
					//   .set({ userId: newUser.user.id })
					//   .where(eq(playHistory.userId, anonymousUser.user.id));
				},
			}),
		],
	});
	return auth;
}

export const auth = getAuth();
