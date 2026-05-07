import { sql } from "drizzle-orm";
import { type ShouldRevalidateFunctionArgs, useFetcher } from "react-router";
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
import { haiToIndex, indexToHai, sortTehai } from "~/lib/hai/types";
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
const TOTAL_TSUMO_PER_KYOKU = 18;
const AGARI_SCORE_DELTA = 8000;

type ShantenAdvanceDiscard = {
	hai: Hai;
	resultingShanten: number;
};

type AgariDetail =
	| {
			type: "standard";
			mentsu: Hai[][];
			janto: Hai[];
	  }
	| {
			type: "chiitoitsu";
			pairs: Hai[][];
	  };

function getHaiKey(hai: Hai): string {
	return `${hai.kind}-${hai.value}`;
}

function shantenLabel(shanten: number): string {
	if (shanten === -1) return "和了";
	if (shanten === 0) return "テンパイ";
	return `${shanten}シャンテン`;
}

function getAgariDetail(tehai: Hai[]): AgariDetail | null {
	const tehaiIndex = Array<number>(34).fill(0);
	for (const hai of tehai) {
		tehaiIndex[haiToIndex(hai) - 1] += 1;
	}

	const pairIndexes: number[] = [];
	for (let i = 0; i < tehaiIndex.length; i++) {
		if (tehaiIndex[i] >= 2) {
			pairIndexes.push(i);
		}
	}

	for (const jantoIndex of pairIndexes) {
		const withoutJanto = tehaiIndex.concat();
		withoutJanto[jantoIndex] -= 2;

		const koutsuCandidates: number[] = [];
		for (let i = 0; i < withoutJanto.length; i++) {
			if (withoutJanto[i] >= 3) {
				koutsuCandidates.push(i);
			}
		}

		for (let bit = 0; bit < 1 << koutsuCandidates.length; bit++) {
			const remaining = withoutJanto.concat();
			const mentsu: Hai[][] = [];
			let isValid = true;

			for (let i = 0; i < koutsuCandidates.length; i++) {
				if (bit & (1 << i)) {
					const idx = koutsuCandidates[i];
					remaining[idx] -= 3;
					if (remaining[idx] < 0) {
						isValid = false;
						break;
					}
					const tile = indexToHai(idx + 1);
					mentsu.push([tile, tile, tile]);
				}
			}
			if (!isValid) continue;

			for (let kind = 0; kind < 3; kind++) {
				for (let i = 0; i <= 6; i++) {
					const idx = kind * 9 + i;
					while (
						remaining[idx] >= 1 &&
						remaining[idx + 1] >= 1 &&
						remaining[idx + 2] >= 1
					) {
						remaining[idx] -= 1;
						remaining[idx + 1] -= 1;
						remaining[idx + 2] -= 1;
						mentsu.push([
							indexToHai(idx + 1),
							indexToHai(idx + 2),
							indexToHai(idx + 3),
						]);
					}
				}
			}

			if (mentsu.length === 4 && remaining.every((count) => count === 0)) {
				const jantoTile = indexToHai(jantoIndex + 1);
				return {
					type: "standard",
					mentsu,
					janto: [jantoTile, jantoTile],
				};
			}
		}
	}

	if (
		pairIndexes.length === 7 &&
		tehaiIndex.every((count) => count === 0 || count === 2)
	) {
		return {
			type: "chiitoitsu",
			pairs: pairIndexes.map((idx) => {
				const tile = indexToHai(idx + 1);
				return [tile, tile];
			}),
		};
	}

	return null;
}

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

export function shouldRevalidate({ formAction }: ShouldRevalidateFunctionArgs) {
	if (formAction?.endsWith("/api/tedashi")) return false;
	if (formAction?.endsWith("/api/tsumogiri")) return false;
	return true;
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const actionFetcher = useFetcher();
	const discardFetcher = useFetcher<GameState>();
	const fetcherGameState =
		discardFetcher.data && "tehai" in discardFetcher.data
			? (discardFetcher.data as GameState)
			: null;

	const currentGameState =
		fetcherGameState?.kyoku === loaderData.kyoku
			? fetcherGameState
			: loaderData;

	const {
		sutehai,
		tsumohai,
		nextTsumohai,
		junme,
		kyoku,
		tehai,
		remainTsumo,
		score,
	} = currentGameState;
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
				optimisticTsumohai = nextTsumohai;
				optimisticJunme = junme + 1;
				optimisticRemainTsumo = nextRemainTsumo;
			}
		}

		if (discardFetcher.formAction?.endsWith("/api/tsumogiri")) {
			optimisticSutehai = [...sutehai, tsumohai];
			optimisticTsumohai = nextTsumohai;
			optimisticJunme = junme + 1;
			optimisticRemainTsumo = nextRemainTsumo;
		}
	}
	const tsumoProgressValue = Math.min(
		TOTAL_TSUMO_PER_KYOKU,
		Math.max(0, TOTAL_TSUMO_PER_KYOKU - optimisticRemainTsumo),
	);

	const isAgari =
		optimisticTehai && optimisticTsumohai
			? judgeAgari(sortTehai([...optimisticTehai, optimisticTsumohai]))
			: false;
	const agariDetail =
		isAgari && optimisticTsumohai
			? getAgariDetail(sortTehai([...optimisticTehai, optimisticTsumohai]))
			: null;
	const shantenResult = optimisticTehai
		? calculateShanten(optimisticTehai)
		: { shanten: 8, isTenpai: false };
	const isRyukyoku = optimisticRemainTsumo <= 0;
	const ryukyokuShanten = shantenResult.shanten;
	const ryukyokuScoreDelta =
		ryukyokuShanten === 0 ? 3000 : ryukyokuShanten === 1 ? 1000 : 0;
	const shantenAdvanceDiscardsByResult = new Map<
		number,
		ShantenAdvanceDiscard[]
	>();
	let isAdvanceHint = true;
	let shantenHintDiscardsByResult = shantenAdvanceDiscardsByResult;
	const isHintCalculating = discardFetcher.state !== "idle";

	if (optimisticTsumohai) {
		const currentShanten = shantenResult.shanten;
		const evaluatedDiscards: ShantenAdvanceDiscard[] = optimisticTehai
			.map((hai, index) => {
				const remainingTehai = optimisticTehai.filter((_, i) => i !== index);
				const nextTehai = sortTehai([...remainingTehai, optimisticTsumohai]);
				return { hai, resultingShanten: calculateShanten(nextTehai).shanten };
			})
			.filter((discard) => discard.resultingShanten < currentShanten);

		const dedupedDiscardMap = new Map<string, ShantenAdvanceDiscard>();
		for (const discard of evaluatedDiscards) {
			const key = `${getHaiKey(discard.hai)}-${discard.resultingShanten}`;
			if (!dedupedDiscardMap.has(key)) {
				dedupedDiscardMap.set(key, discard);
			}
		}

		for (const discard of dedupedDiscardMap.values()) {
			const current =
				shantenAdvanceDiscardsByResult.get(discard.resultingShanten) ?? [];
			current.push(discard);
			shantenAdvanceDiscardsByResult.set(discard.resultingShanten, current);
		}

		if (shantenAdvanceDiscardsByResult.size === 0) {
			const shantenKeepDiscardsByResult = new Map<
				number,
				ShantenAdvanceDiscard[]
			>();
			const shantenKeepDiscards = optimisticTehai
				.map((hai, index) => {
					const remainingTehai = optimisticTehai.filter((_, i) => i !== index);
					const nextTehai = sortTehai([...remainingTehai, optimisticTsumohai]);
					return { hai, resultingShanten: calculateShanten(nextTehai).shanten };
				})
				.filter((discard) => discard.resultingShanten === currentShanten);
			shantenKeepDiscards.push({
				hai: optimisticTsumohai,
				resultingShanten: currentShanten,
			});

			const dedupedKeepDiscardMap = new Map<string, ShantenAdvanceDiscard>();
			for (const discard of shantenKeepDiscards) {
				const key = `${getHaiKey(discard.hai)}-${discard.resultingShanten}`;
				if (!dedupedKeepDiscardMap.has(key)) {
					dedupedKeepDiscardMap.set(key, discard);
				}
			}

			for (const discard of dedupedKeepDiscardMap.values()) {
				const current =
					shantenKeepDiscardsByResult.get(discard.resultingShanten) ?? [];
				current.push(discard);
				shantenKeepDiscardsByResult.set(discard.resultingShanten, current);
			}

			if (shantenKeepDiscardsByResult.size > 0) {
				isAdvanceHint = false;
				shantenHintDiscardsByResult = shantenKeepDiscardsByResult;
			}
		}
	}

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
						<p className="mt-2">獲得スコア: +{AGARI_SCORE_DELTA}</p>
						{agariDetail?.type === "standard" && (
							<div className="mt-2">
								<p className="text-sm mb-1">雀頭</p>
								<div className="flex gap-0 mb-2">
									{(() => {
										const seen = new Map<string, number>();
										return agariDetail.janto.map((hai) => {
											const baseKey = getHaiKey(hai);
											const count = (seen.get(baseKey) ?? 0) + 1;
											seen.set(baseKey, count);
											return (
												<img
													key={`janto-${baseKey}-${count}`}
													src={`/hai/${hai.kind}_${hai.value}.png`}
													alt={`${hai.kind} ${hai.value}`}
													className="w-8 h-11 md:w-10 md:h-14"
												/>
											);
										});
									})()}
								</div>
								<p className="text-sm mb-1">面子</p>
								<div className="grid grid-cols-1 md:grid-cols-[max-content_max-content] md:justify-start gap-y-1 md:gap-x-10">
									{(() => {
										const seenMentsu = new Map<string, number>();
										return agariDetail.mentsu.map((mentsu) => {
											const mentsuKeyBase = mentsu.map(getHaiKey).join("_");
											const mentsuCount =
												(seenMentsu.get(mentsuKeyBase) ?? 0) + 1;
											seenMentsu.set(mentsuKeyBase, mentsuCount);
											const seenHai = new Map<string, number>();
											return (
												<div
													key={`mentsu-${mentsuKeyBase}-${mentsuCount}`}
													className="flex gap-0"
												>
													{mentsu.map((hai) => {
														const baseKey = getHaiKey(hai);
														const count = (seenHai.get(baseKey) ?? 0) + 1;
														seenHai.set(baseKey, count);
														return (
															<img
																key={`mentsu-hai-${baseKey}-${count}`}
																src={`/hai/${hai.kind}_${hai.value}.png`}
																alt={`${hai.kind} ${hai.value}`}
																className="w-8 h-11 md:w-10 md:h-14"
															/>
														);
													})}
												</div>
											);
										});
									})()}
								</div>
							</div>
						)}
						{agariDetail?.type === "chiitoitsu" && (
							<div className="mt-2">
								<p className="text-sm mb-1">七対子</p>
								<div className="grid grid-cols-4 gap-1">
									{(() => {
										const seenPairs = new Map<string, number>();
										return agariDetail.pairs.map((pair) => {
											const pairKeyBase = pair.map(getHaiKey).join("_");
											const pairCount = (seenPairs.get(pairKeyBase) ?? 0) + 1;
											seenPairs.set(pairKeyBase, pairCount);
											const seenHai = new Map<string, number>();
											return (
												<div
													key={`pair-${pairKeyBase}-${pairCount}`}
													className="flex gap-0"
												>
													{pair.map((hai) => {
														const baseKey = getHaiKey(hai);
														const count = (seenHai.get(baseKey) ?? 0) + 1;
														seenHai.set(baseKey, count);
														return (
															<img
																key={`pair-hai-${baseKey}-${count}`}
																src={`/hai/${hai.kind}_${hai.value}.png`}
																alt={`${hai.kind} ${hai.value}`}
																className="w-8 h-11 md:w-10 md:h-14"
															/>
														);
													})}
												</div>
											);
										});
									})()}
								</div>
							</div>
						)}
						<div className="modal-action">
							<actionFetcher.Form method="post" action="/api/agari">
								<input type="hidden" value={junme} name="junme" />
								<button
									className="btn bg-yellow-600 text-white border-none"
									type="submit"
									disabled={actionFetcher.state !== "idle"}
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
						<p className="mt-2">
							シャンテン: {ryukyokuShanten} / 獲得スコア: +{ryukyokuScoreDelta}
						</p>
						<div className="modal-action">
							<actionFetcher.Form method="post" action="/api/ryukyoku">
								<button
									className="btn bg-yellow-600 text-white border-none"
									type="submit"
									disabled={actionFetcher.state !== "idle"}
								>
									確認
								</button>
							</actionFetcher.Form>
						</div>
					</div>
				</dialog>
			)}

			<div className="max-w-6xl mx-auto">
				<div className="mb-2 md:mb-3 bg-[#0F2918] rounded-lg p-2 md:p-3 border border-[#1A472A]">
					<div className="flex flex-col gap-2">
						<p className="text-lg md:text-2xl font-bold text-yellow-300 leading-tight">
							東{kyoku}局{" "}
							<span className="text-white text-base md:text-lg font-semibold">
								| 巡目: {optimisticJunme} / 18
							</span>
						</p>
						<div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base">
							<span className="bg-[#1A472A] border border-[#2E6A47] rounded px-2 py-1">
								スコア: {score}
							</span>
							<span className="bg-[#1A472A] border border-[#2E6A47] rounded px-2 py-1">
								シャンテン:{" "}
								{shantenResult.shanten === -1 ? "和了" : shantenResult.shanten}
							</span>
						</div>
					</div>
					<div className="mt-2">
						<progress
							className="progress progress-warning w-full h-2"
							value={tsumoProgressValue}
							max={TOTAL_TSUMO_PER_KYOKU}
						/>
					</div>
				</div>

				<div className="mb-3 md:flex md:items-start md:gap-3">
					<div>
						<h3 className="text-sm md:text-base mb-1 text-yellow-300">
							捨て牌
						</h3>
						<div className="grid grid-cols-6 gap-0 min-h-36 md:min-h-44 content-start bg-[#0F2918] rounded-md p-2 border border-[#1A472A] w-[13rem] md:w-[16rem]">
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
					<div className="mt-2 md:mt-0 md:flex-1 text-sm md:text-base">
						{isHintCalculating ? (
							<p className="text-sm md:text-base mb-1 text-yellow-300">
								計算中...
							</p>
						) : shantenHintDiscardsByResult.size === 0 ? (
							<p className="text-sm md:text-base mb-1 text-yellow-300">なし</p>
						) : (
							<div className="mb-1">
								{[...shantenHintDiscardsByResult.entries()]
									.sort(([a], [b]) => a - b)
									.map(([resultingShanten]) => (
										<p
											key={resultingShanten}
											className="text-sm md:text-base text-yellow-300"
										>
											{isAdvanceHint
												? `${shantenLabel(resultingShanten)}に進む打牌`
												: `${shantenLabel(resultingShanten)}を維持する打牌`}
										</p>
									))}
							</div>
						)}
						<div className="bg-[#0F2918] rounded-lg p-2 border border-[#1A472A] h-[3.875rem] md:h-auto md:min-h-44">
							<div className="h-full min-w-0 overflow-x-auto overflow-y-hidden flex items-center gap-0">
								{isHintCalculating ? (
									<p className="text-sm md:text-base text-yellow-300">
										計算中...
									</p>
								) : (
									[...shantenHintDiscardsByResult.entries()]
										.sort(([a], [b]) => a - b)
										.map(([resultingShanten, discards]) => (
											<div
												key={resultingShanten}
												className="flex gap-0 shrink-0"
											>
												{discards.map((discard) => (
													<img
														key={`${getHaiKey(discard.hai)}-${discard.resultingShanten}`}
														src={`/hai/${discard.hai.kind}_${discard.hai.value}.png`}
														alt={`${discard.hai.kind} ${discard.hai.value}`}
														className="w-8 h-11 md:w-10 md:h-14"
													/>
												))}
											</div>
										))
								)}
							</div>
						</div>
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
