import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import type { c } from "node_modules/better-auth/dist/shared/better-auth.C9FmyZ5W.cjs";
import { Link, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
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
	const navigate = useNavigate();
	const anonymousLoginAndStart = async () => {
		const user = await authClient.getSession();
		if (!user) {
			const _user = await authClient.signIn.anonymous();
		}
		navigate("/play");
	};
	return (
		<>
			<h1 className="text-5xl text-center pb-1">Hitori Mahjong</h1>
			<div className="flex justify-center items-center flex-col gap-4 py-4">
				<button onClick={anonymousLoginAndStart} className="link" type="button">
					Play as Guest
				</button>
				<Link to="/login" className="link">
					Login
				</Link>
				<Link to="/learn" className="link">
					Learn How to Play
				</Link>
			</div>
		</>
	);
}
