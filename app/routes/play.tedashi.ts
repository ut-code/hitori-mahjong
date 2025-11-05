import { getAuth } from "~/lib/auth";
import { type GameState, getRedisClient, tedashi } from "~/lib/redis";
import type { Route } from "./+types/play.tedashi";

export async function action({
	context,
	request,
}: Route.ActionArgs): Promise<GameState> {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	const formData = await request.formData();
	const index = Number(formData.get("index"));

	if (isNaN(index)) {
		throw new Response("Invalid index", { status: 400 });
	}

	const redisClient = getRedisClient(env);
	await redisClient.connect();

	try {
		await tedashi(redisClient, userId, index);
		const gameStateJSON = await redisClient.get(`user:${userId}:game`);
		const gameState = gameStateJSON ? JSON.parse(gameStateJSON) : null;

		await redisClient.quit();
		return gameState;
	} catch (error) {
		await redisClient.quit();
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Response(errorMessage, { status: 400 });
	}
}
