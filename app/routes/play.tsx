import { sql } from "drizzle-orm";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { hai, haiyama } from "~/lib/db/schema";
import { dbHaiToHai } from "~/lib/hai";
import { type GameState, getRedisClient, init } from "~/lib/redis";
import type { Route } from "./+types/play";

export async function loader({
	context,
	request,
}: Route.LoaderArgs): Promise<GameState> {
	const { env } = context.cloudflare;
	const db = getDB(env);
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	// Check if game state already exists in Redis
	const redisClient = getRedisClient(env);
	await redisClient.connect();

	try {
		const existingGameState = await redisClient.get(`user:${userId}:game`);

		if (existingGameState) {
			// Return existing game state from Redis
			await redisClient.quit();
			return JSON.parse(existingGameState);
		}

		// No existing game state, so initialize from PostgreSQL
		const randomHaiyama = await db
			.select()
			.from(haiyama)
			.orderBy(sql`RANDOM()`)
			.limit(1);

		if (randomHaiyama.length === 0) {
			await redisClient.quit();
			throw new Response("No haiyama found", { status: 404 });
		}

		const selectedHaiyama = randomHaiyama[0];
		const rawHaiData = await db
			.select()
			.from(hai)
			.where(sql`${hai.haiyamaId} = ${selectedHaiyama.id}`)
			.orderBy(hai.order);

		const haiData = rawHaiData.map((hai) => dbHaiToHai(hai));

		// Initialize game state in Redis
		await init(redisClient, userId, haiData);

		// Get the initialized game state to return
		const gameStateJSON = await redisClient.get(`user:${userId}:game`);
		const gameState = gameStateJSON ? JSON.parse(gameStateJSON) : null;

		await redisClient.quit();
		return gameState;
	} catch (error) {
		await redisClient.quit();
		throw error instanceof Error ? error : new Error(String(error));
	}
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const exampleHai = loaderData.haiyama[0];
	return (
		<>
			<p>Play Page</p>
			<img
				src={`/hai/${exampleHai.kind}_${exampleHai.value}.png`}
				alt={`${hai.kind} ${hai.value}`}
				className="cursor-pointer"
			/>
		</>
	);
}
