import { redirect } from "react-router";
import { getAuth } from "~/lib/auth";
import { type GameState, getRedisClient, tsumogiri } from "~/lib/redis";
import type { Route } from "./+types/play.tsumogiri";

export async function action({ context, request }: Route.ActionArgs) {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	const redisClient = getRedisClient(env);
	await redisClient.connect();

	try {
		await tsumogiri(redisClient, userId);
		const gameStateJSON = await redisClient.get(`user:${userId}:game`);
		const gameState = gameStateJSON ? JSON.parse(gameStateJSON) : null;

		await redisClient.quit();
		return redirect("/play");
	} catch (error) {
		await redisClient.quit();
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Response(errorMessage, { status: 400 });
	}
}
