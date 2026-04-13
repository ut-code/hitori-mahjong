import { sql } from "drizzle-orm";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { haiyama } from "~/lib/db/schema";
import {
	getGameState,
	getRandomHaiyamaOrCreate,
	initGame,
	seedHaiyama,
	toGameState,
} from "~/lib/game-service";
import judgeAgari from "~/lib/hai/agari";
import { calculateShanten } from "~/lib/hai/shanten";
import type { Hai } from "~/lib/hai/types";
import { sortTehai } from "~/lib/hai/types";
import type { GameState } from "~/lib/types";
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

	try {
		// Auto-seed haiyama if empty
		const haiCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(haiyama)
			.get();
		if (!haiCount || haiCount.count === 0) {
			await seedHaiyama(db, 20);
		}

		// Check if game state already exists in D1
		const existingState = await getGameState(db, userId);

		if (existingState) {
			return toGameState(existingState);
		}

		// No existing game state, so initialize from haiyama
		const randomHaiyama = await getRandomHaiyamaOrCreate(db);
		const haiData = randomHaiyama.tiles;
		const haiyamaId = randomHaiyama.id;

		// Initialize game state in D1
		await initGame(db, userId, haiyamaId, haiData);

		// Get the initialized game state
		const gameStateRecord = await getGameState(db, userId);
		if (!gameStateRecord) {
			throw new Error("Failed to get current game state");
		}
		return toGameState(gameStateRecord);
	} catch (error) {
		if (error instanceof Response) {
			throw error;
		}
		throw error instanceof Error ? error : new Error(String(error));
	}
}

export default function Page({ loaderData }: Route.ComponentProps) {
	let { sutehai, tsumohai, junme, kyoku, tehai, remainTsumo, score } =
		loaderData;
	tehai = sortTehai(tehai);
	const isAgari =
		tehai && tsumohai ? judgeAgari(sortTehai([...tehai, tsumohai])) : false;
	const shantenResult = tehai
		? calculateShanten(tehai)
		: { shanten: 8, isTenpai: false };
	const isRyukyoku = remainTsumo <= 0;

	type IndexedHai = Hai & { index: number };

	const indexedSutehai: IndexedHai[] = sutehai.map(
		(hai: Hai, index: number) => ({
			...hai,
			index,
		}),
	);
	const indexedTehai: IndexedHai[] = tehai.map((hai: Hai, index: number) => ({
		...hai,
		index,
	}));

	return (
		<div className="p-4">
			{isAgari && (
				<dialog id="agari_modal" className="modal" open>
					<div className="modal-box">
						<h3 className="font-bold text-lg">ツモ！</h3>
						<div className="modal-action">
							<form method="post" action="/api/agari">
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
							<form method="post" action="/api/ryukyoku">
								<button className="btn" type="submit">
									確認
								</button>
							</form>
						</div>
					</div>
				</dialog>
			)}

			<div className="flex justify-between items-center mb-4">
				<p className="text-xl">
					東{kyoku}局 | 巡目: {junme} | 残りツモ: {remainTsumo}
				</p>
				<p className="text-xl">
					スコア: {score} | シャンテン:{" "}
					{shantenResult.shanten === -1 ? "和了" : shantenResult.shanten}
				</p>
			</div>

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
							<form key={hai.index} method="post" action="/api/tedashi">
								<input type="hidden" name="index" value={hai.index} />
								<button type="submit">
									<img
										src={`/hai/${hai.kind}_${hai.value}.png`}
										alt={`${hai.kind} ${hai.value}`}
										className="w-12 h-16 cursor-pointer hover:scale-105 transition-transform"
									/>
								</button>
							</form>
						))}
					</div>
				</div>

				{tsumohai && (
					<div>
						<h3 className="text-lg mb-2">ツモ牌</h3>
						<form method="post" action="/api/tsumogiri">
							<button type="submit">
								<img
									src={`/hai/${tsumohai.kind}_${tsumohai.value}.png`}
									alt={`${tsumohai.kind} ${tsumohai.value}`}
									className="w-12 h-16 object-contain cursor-pointer hover:scale-105 transition-transform"
								/>
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
