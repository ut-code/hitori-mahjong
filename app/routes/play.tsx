import { sql } from "drizzle-orm";
import { useFetcher } from "react-router";
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

const SUHAI_KINDS = ["manzu", "pinzu", "souzu"] as const;
const JIHAI_VALUES = [
	"ton",
	"nan",
	"sya",
	"pei",
	"haku",
	"hatsu",
	"tyun",
] as const;
const TILE_IMAGE_PATHS = [
	...SUHAI_KINDS.flatMap((kind) =>
		Array.from({ length: 9 }, (_, index) => `/hai/${kind}_${index + 1}.png`),
	),
	...JIHAI_VALUES.map((value) => `/hai/jihai_${value}.png`),
];

export const links: Route.LinksFunction = () =>
	TILE_IMAGE_PATHS.map((href) => ({
		rel: "preload",
		as: "image",
		href,
	}));

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
			await seedHaiyama(db, 40);
		}

		// Check if game state already exists in D1
		const existingState = await getGameState(db, userId);

		if (existingState) {
			return toGameState(existingState);
		}

		// No existing game state, so initialize from haiyama
		const randomHaiyama = await getRandomHaiyamaOrCreate(db, userId);
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
	const actionFetcher = useFetcher();
	const discardFetcher = useFetcher();
	const { sutehai, tsumohai, junme, kyoku, tehai, remainTsumo, score } =
		loaderData;
	const baseSortedTehai = sortTehai(tehai);
	let optimisticSutehai = sutehai;
	let optimisticTehai = baseSortedTehai;
	let optimisticTsumohai = tsumohai;
	let optimisticJunme = junme;
	let optimisticRemainTsumo = remainTsumo;

	if (
		discardFetcher.state !== "idle" &&
		discardFetcher.formData &&
		tsumohai !== null
	) {
		const nextRemainTsumo = Math.max(0, remainTsumo - 1);
		if (discardFetcher.formAction?.endsWith("/api/tedashi")) {
			const index = Number(discardFetcher.formData.get("index"));
			if (
				Number.isInteger(index) &&
				index >= 0 &&
				index < baseSortedTehai.length
			) {
				const discardedHai = baseSortedTehai[index];
				const remainingTehai = baseSortedTehai.filter((_, i) => i !== index);
				optimisticSutehai = [...sutehai, discardedHai];
				optimisticTehai = sortTehai([...remainingTehai, tsumohai]);
				optimisticTsumohai = null;
				optimisticJunme = junme + 1;
				optimisticRemainTsumo = nextRemainTsumo;
			}
		}

		if (discardFetcher.formAction?.endsWith("/api/tsumogiri")) {
			optimisticSutehai = [...sutehai, tsumohai];
			optimisticTsumohai = null;
			optimisticJunme = junme + 1;
			optimisticRemainTsumo = nextRemainTsumo;
		}
	}

	const isAgari =
		optimisticTehai && optimisticTsumohai
			? judgeAgari(sortTehai([...optimisticTehai, optimisticTsumohai]))
			: false;
	const shantenResult = optimisticTehai
		? calculateShanten(optimisticTehai)
		: { shanten: 8, isTenpai: false };
	const isRyukyoku = optimisticRemainTsumo <= 0;

	type IndexedHai = Hai & { index: number };

	const indexedSutehai: IndexedHai[] = optimisticSutehai.map(
		(hai: Hai, index: number) => ({
			...hai,
			index,
		}),
	);
	const indexedTehai: IndexedHai[] = optimisticTehai.map(
		(hai: Hai, index: number) => ({
			...hai,
			index,
		}),
	);
	const firstRowTehai = indexedTehai.slice(0, 7);
	const secondRowTehai = indexedTehai.slice(7);

	return (
		<div className="min-h-screen bg-[#1A472A] p-3 md:p-4 font-serif text-white">
			{isAgari && (
				<dialog id="agari_modal" className="modal" open>
					<div className="modal-box bg-[#0F2918] border border-yellow-700 text-white">
						<h3 className="font-bold text-2xl text-yellow-400">和了</h3>
						<div className="modal-action">
							<actionFetcher.Form method="post" action="/api/agari">
								<input type="hidden" value={junme} name="junme" />
								<button
									className="btn bg-yellow-600 text-white border-none"
									type="submit"
								>
									確認
								</button>
							</actionFetcher.Form>
						</div>
					</div>
				</dialog>
			)}
			{isRyukyoku && (
				<dialog id="ryukyoku_modal" className="modal" open>
					<div className="modal-box bg-[#0F2918] border border-yellow-700 text-white">
						<h3 className="font-bold text-2xl text-yellow-400">流局</h3>
						<div className="modal-action">
							<actionFetcher.Form method="post" action="/api/ryukyoku">
								<button
									className="btn bg-yellow-600 text-white border-none"
									type="submit"
								>
									確認
								</button>
							</actionFetcher.Form>
						</div>
					</div>
				</dialog>
			)}

			<div className="max-w-6xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 mb-2 md:mb-3 text-sm md:text-base bg-[#0F2918] rounded-lg p-2 md:p-3 border border-[#1A472A]">
					<p>
						東{kyoku}局 | 巡目: {optimisticJunme} | 残りツモ:{" "}
						{optimisticRemainTsumo}
					</p>
					<p className="md:text-right">
						スコア: {score} | シャンテン:{" "}
						{shantenResult.shanten === -1 ? "和了" : shantenResult.shanten}
					</p>
				</div>

				<div className="mb-3">
					<h3 className="text-sm md:text-base mb-1 text-yellow-300">捨て牌</h3>
					<div className="grid grid-cols-6 gap-0 min-h-36 md:min-h-44 content-start bg-[#0F2918] rounded-md p-1 md:p-2 border border-[#1A472A] w-[13rem] md:w-[16rem]">
						{indexedSutehai.map((hai) => (
							<img
								key={hai.index}
								src={`/hai/${hai.kind}_${hai.value}.png`}
								alt={`${hai.kind} ${hai.value}`}
								className="w-8 h-11 md:w-10 md:h-14"
							/>
						))}
					</div>
				</div>

				<div>
					<h3 className="text-sm md:text-base mb-1 text-yellow-300">手牌</h3>

					<div className="hidden md:flex items-end gap-0 bg-[#0F2918] rounded-md p-2 border border-[#1A472A] w-fit">
						{indexedTehai.map((hai) => (
							<discardFetcher.Form
								key={hai.index}
								method="post"
								action="/api/tedashi"
							>
								<input type="hidden" name="index" value={hai.index} />
								<button
									type="submit"
									aria-label={`捨てる ${hai.kind} ${hai.value}`}
									disabled={discardFetcher.state !== "idle"}
								>
									<img
										src={`/hai/${hai.kind}_${hai.value}.png`}
										alt={`${hai.kind} ${hai.value}`}
										className="w-10 h-14 cursor-pointer hover:scale-105 transition-transform"
									/>
								</button>
							</discardFetcher.Form>
						))}
						{optimisticTsumohai && (
							<div className="ml-1">
								<discardFetcher.Form method="post" action="/api/tsumogiri">
									<button
										type="submit"
										aria-label={`ツモ切り ${optimisticTsumohai.kind} ${optimisticTsumohai.value}`}
										disabled={discardFetcher.state !== "idle"}
									>
										<img
											src={`/hai/${optimisticTsumohai.kind}_${optimisticTsumohai.value}.png`}
											alt={`${optimisticTsumohai.kind} ${optimisticTsumohai.value}`}
											className="w-10 h-14 object-contain cursor-pointer hover:scale-105 transition-transform"
										/>
									</button>
								</discardFetcher.Form>
							</div>
						)}
					</div>

					<div className="md:hidden bg-[#0F2918] rounded-md p-2 border border-[#1A472A] w-fit">
						<div className="grid grid-cols-7 gap-0">
							{firstRowTehai.map((hai) => (
								<discardFetcher.Form
									key={hai.index}
									method="post"
									action="/api/tedashi"
								>
									<input type="hidden" name="index" value={hai.index} />
									<button
										type="submit"
										aria-label={`捨てる ${hai.kind} ${hai.value}`}
										disabled={discardFetcher.state !== "idle"}
									>
										<img
											src={`/hai/${hai.kind}_${hai.value}.png`}
											alt={`${hai.kind} ${hai.value}`}
											className="w-8 h-11 cursor-pointer hover:scale-105 transition-transform"
										/>
									</button>
								</discardFetcher.Form>
							))}
						</div>

						<div className="grid grid-cols-7 gap-0 mt-1">
							{secondRowTehai.map((hai) => (
								<discardFetcher.Form
									key={hai.index}
									method="post"
									action="/api/tedashi"
								>
									<input type="hidden" name="index" value={hai.index} />
									<button
										type="submit"
										aria-label={`捨てる ${hai.kind} ${hai.value}`}
										disabled={discardFetcher.state !== "idle"}
									>
										<img
											src={`/hai/${hai.kind}_${hai.value}.png`}
											alt={`${hai.kind} ${hai.value}`}
											className="w-8 h-11 cursor-pointer hover:scale-105 transition-transform"
										/>
									</button>
								</discardFetcher.Form>
							))}
							{optimisticTsumohai && (
								<discardFetcher.Form method="post" action="/api/tsumogiri">
									<button
										type="submit"
										aria-label={`ツモ切り ${optimisticTsumohai.kind} ${optimisticTsumohai.value}`}
										disabled={discardFetcher.state !== "idle"}
									>
										<img
											src={`/hai/${optimisticTsumohai.kind}_${optimisticTsumohai.value}.png`}
											alt={`${optimisticTsumohai.kind} ${optimisticTsumohai.value}`}
											className="w-8 h-11 object-contain cursor-pointer hover:scale-105 transition-transform"
										/>
									</button>
								</discardFetcher.Form>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
