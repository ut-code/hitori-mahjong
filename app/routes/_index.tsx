import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Link } from "react-router";
import { getRedisClient } from "~/lib/redis";
import type { Route } from "./+types/_index";

export async function loader({ context }: Route.LoaderArgs) {
	const { env } = context.cloudflare;
	const db =
		env.NODE_ENV === "development"
			? drizzlePg(env.DATABASE_URL)
			: drizzleNeon(env.DATABASE_URL);
	const redisClient = getRedisClient(env);
	redisClient.on("error", (err) => console.log("Redis Client Error", err));
	await redisClient.connect();
	await redisClient.set("key", "value");
	const value = await redisClient.get("key");
	console.log(value);
}

export default function Page() {
	return (
		<>
			<h1 className="text-5xl text-center pb-1">Hitori Mahjong</h1>
			<Link to="/start">
				<p className="text-center link">Get Started</p>
			</Link>

			<Link to="/learn">
				<p className="text-center link">Learn How to Play</p>
			</Link>
		</>
	);
}
