import { sql } from "drizzle-orm";
import { Form } from "react-router";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { hai, haiyama } from "~/lib/db/schema";
import judgeAgari from "~/lib/hai/judgeAgari";
import { dbHaiToHai, sortTehai } from "~/lib/hai/utils";
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
	let { haiyama, sutehai, tsumohai, junme, kyoku, tehai } = loaderData;
	tehai = sortTehai(tehai);
	const isAgari =
		tehai && tsumohai ? judgeAgari(sortTehai([...tehai, tsumohai])) : false;
	const isRyukyoku = junme === 19;
	const indexedSutehai = sutehai.map((hai, index) => ({
		...hai,
		index: index,
	}));
	const indexedTehai = tehai.map((hai, index) => ({
		...hai,
		index: index,
	}));

	return (
		<div className="p-4">
			{isAgari && (
				<dialog id="agari_modal" className="modal" open>
					<div className="modal-box">
						<h3 className="font-bold text-lg">ツモ！</h3>
						<div className="modal-action">
							<form method="post" action="/play/agari">
								<input type="hidden" value={junme} name="junme" />
								<button className="btn" type="submit">
									確認
								</button>
							</form>
						</div>
					</div>
				</dialog>
			)}
			{isRyukyoku && (
				<dialog id="ryukyoku_modal" className="modal" open>
					<div className="modal-box">
						<h3 className="font-bold text-lg">流局</h3>
						<div className="modal-action">
							<form method="post" action="/play/ryukyoku">
								<button className="btn" type="submit">
									確認
								</button>
							</form>
						</div>
					</div>
				</dialog>
			)}

			<p className="text-xl mb-4">
				Play Page - 局 {kyoku} 巡目 {junme}
			</p>

			{/* Sutehai grid (3x6) */}
			<div className="mb-6">
				<h3 className="text-lg mb-2">捨て牌</h3>
				<div className="grid grid-cols-6 gap-0 w-max min-h-48">
					{indexedSutehai.map((hai) => (
						<img
							key={hai.index}
							src={`/hai/${hai.kind}_${hai.value}.png`}
							alt={`${hai.kind} ${hai.value}`}
							className="w-12 h-16"
						/>
					))}
				</div>
			</div>

			{/* Tehai and Tsumohai */}
			<div className="flex items-center gap-4">
				<div>
					<h3 className="text-lg mb-2">手牌</h3>
					<div className="flex gap-0">
						{indexedTehai.map((hai) => (
							<Form key={hai.index} method="post" action="/play/tedashi">
								<input type="hidden" name="index" value={hai.index} />
								<button type="submit">
									<img
										src={`/hai/${hai.kind}_${hai.value}.png`}
										alt={`${hai.kind} ${hai.value}`}
										className="w-12 h-16 cursor-pointer hover:scale-105 transition-transform"
									/>
								</button>
							</Form>
						))}
					</div>
				</div>

				{tsumohai && (
					<div>
						<h3 className="text-lg mb-2">ツモ牌</h3>
						<Form method="post" action="/play/tsumogiri">
							<button type="submit">
								<img
									src={`/hai/${tsumohai.kind}_${tsumohai.value}.png`}
									alt={`${tsumohai.kind} ${tsumohai.value}`}
									className="w-12 h-16 object-contain cursor-pointer hover:scale-105 transition-transform"
								/>
							</button>
						</Form>
					</div>
				)}
			</div>
		</div>
	);
}
