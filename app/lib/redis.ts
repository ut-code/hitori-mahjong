import { createClient } from "redis";

export function getRedisClient(env: Env) {
	const client = createClient({
		url: env.REDIS_URL,
	});
	return client;
}
