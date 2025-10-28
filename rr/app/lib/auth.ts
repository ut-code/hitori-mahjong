import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "./db";

export function getAuth(env?: Env) {
  const auth = betterAuth({
    database: drizzleAdapter(getDB(env), {
      provider: "pg",
    }),
    emailAndPassword: {
      enabled: true,
    },
  });
  return auth;
}

export const auth = getAuth();
