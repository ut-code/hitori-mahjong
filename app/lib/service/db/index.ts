import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

export function getDB() {
  return drizzle(env.DB);
}
