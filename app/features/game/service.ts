import type { DrizzleD1Database } from "drizzle-orm/d1";
import judgeAgari from "@/lib/agari";
import { sortTehai } from "@/lib/hai";
import { getAgariScoreDelta } from "@/lib/score";
import { calculateShanten } from "@/lib/shanten";
import type {
	GameOverData,
	GameState,
	GameStateRecord,
	KyokuRecord,
	ScoreData,
} from "@/types/game";
import type { Hai } from "@/types/hai";
import * as repo from "./repository";

export class GameError extends Error {
	constructor(
		message: string,
		public readonly status: number = 400,
	) {
		super(message);
		this.name = "GameError";
	}
}

export async function getGameState(
	db: DrizzleD1Database,
	userId: string,
): Promise<GameStateRecord | null> {
	return repo.fetchGameState(db, userId);
}

export async function getRandomHaiyama(db: DrizzleD1Database, userId: string) {
	const playedIds = await repo.fetchPlayedHaiyamaIds(db, userId);
	return repo.fetchRandomHaiyama(db, playedIds);
}

export async function initGame(
	db: DrizzleD1Database,
	userId: string,
	haiyamaId: string,
	tiles: Hai[],
) {
	const tehai = tiles.slice(0, 13);
	const tsumohai = tiles[13] ? [tiles[13]] : [];
	const remainingHai = tiles.slice(14);
	await repo.clearKyokuByUser(db, userId);
	await repo.upsertGameState(db, userId, {
		kyoku: 1,
		junme: 1,
		remainTsumo: 18,
		score: 25000,
		haiyama: remainingHai,
		sutehai: [],
		tehai,
		tsumohai,
		haiyamaId,
	});
}

export async function startNewGame(db: DrizzleD1Database, userId: string) {
	const randomHaiyama = await getRandomHaiyama(db, userId);
	const { id: haiyamaId, tiles: haiData } = randomHaiyama[0];
	await initGame(db, userId, haiyamaId, haiData);
}

export async function tedashi(
	db: DrizzleD1Database,
	userId: string,
	index: number,
) {
	const state = await repo.fetchGameState(db, userId);
	if (!state) throw new Error("Game not found");
	if (state.tsumohai.length === 0) throw new Error("No tsumohai to discard");
	if (index < 0 || index >= state.tehai.length)
		throw new Error("Invalid tile index");

	const tsumohai = state.tsumohai[0];
	const sortedTehai = sortTehai(state.tehai);
	const discardedHai = sortedTehai[index];
	const remainingTehai = sortedTehai.filter((_, i) => i !== index);
	const newHaiyama = state.haiyama.slice(1);

	await repo.patchGameState(db, userId, {
		junme: state.junme + 1,
		remainTsumo: state.remainTsumo - 1,
		haiyama: newHaiyama,
		sutehai: [...state.sutehai, discardedHai],
		tehai: sortTehai([...remainingTehai, tsumohai]),
		tsumohai: newHaiyama.length > 0 ? [newHaiyama[0]] : [],
	});
}

export async function tsumogiri(db: DrizzleD1Database, userId: string) {
	const state = await repo.fetchGameState(db, userId);
	if (!state) throw new Error("Game not found");
	if (state.tsumohai.length === 0) throw new Error("No tsumohai to discard");

	const newHaiyama = state.haiyama.slice(1);

	await repo.patchGameState(db, userId, {
		junme: state.junme + 1,
		remainTsumo: state.remainTsumo - 1,
		haiyama: newHaiyama,
		sutehai: [...state.sutehai, state.tsumohai[0]],
		tsumohai: newHaiyama.length > 0 ? [newHaiyama[0]] : [],
	});
}

export async function jikyoku(db: DrizzleD1Database, userId: string) {
	const state = await repo.fetchGameState(db, userId);
	if (!state) throw new Error("Game not found");
	await repo.patchGameState(db, userId, { kyoku: state.kyoku + 1 });
}

async function restartGame(
	db: DrizzleD1Database,
	userId: string,
): Promise<{ isGameOver: boolean }> {
	const state = await repo.fetchGameState(db, userId);
	if (!state) throw new Error("Game not found");

	const newKyoku = state.kyoku + 1;
	if (newKyoku > 4) return { isGameOver: true };

	const randomHaiyama = await getRandomHaiyama(db, userId);
	const { id: newHaiyamaId, tiles } = randomHaiyama[0];
	const tehai = tiles.slice(0, 13);
	const tsumohai = tiles[13] ? [tiles[13]] : [];
	const remainingHai = tiles.slice(14);

	await repo.patchGameState(db, userId, {
		kyoku: newKyoku,
		junme: 1,
		remainTsumo: 18,
		haiyama: remainingHai,
		sutehai: [],
		tehai,
		tsumohai,
		haiyamaId: newHaiyamaId,
	});

	return { isGameOver: false };
}

async function recordKyoku(
	db: DrizzleD1Database,
	userId: string,
	options: {
		didAgari: boolean;
		agariJunme?: number;
		shanten: number;
		scoreDelta: number;
	},
) {
	const state = await repo.fetchGameState(db, userId);
	if (!state) throw new Error("Game not found");
	if (!state.haiyamaId) throw new Error("Haiyama ID not found");

	await repo.insertKyokuRecord(db, {
		userId,
		haiyamaId: state.haiyamaId,
		didAgari: options.didAgari,
		agariJunme: options.agariJunme ?? null,
		shanten: options.shanten,
		scoreDelta: options.scoreDelta,
	});
	await repo.patchGameState(db, userId, {
		score: state.score + options.scoreDelta,
	});
	await repo.refreshHaiyamaStats(db, state.haiyamaId);
}

export async function performAgari(
	db: DrizzleD1Database,
	userId: string,
): Promise<{ isGameOver: boolean }> {
	const state = await repo.fetchGameState(db, userId);
	if (!state) throw new GameError("Game state not found", 404);

	const tsumohai = state.tsumohai[0];
	if (!tsumohai) throw new GameError("No tile drawn - cannot declare win");
	if (!judgeAgari(sortTehai([...state.tehai, tsumohai])))
		throw new GameError("Hand does not form a valid winning combination");

	const scoreDelta = getAgariScoreDelta(state.junme);
	await recordKyoku(db, userId, {
		didAgari: true,
		agariJunme: state.junme,
		shanten: 0,
		scoreDelta,
	});

	const { isGameOver } = await restartGame(db, userId);
	if (isGameOver) await repo.removeGameState(db, userId);
	return { isGameOver };
}

export async function performRyukyoku(
	db: DrizzleD1Database,
	userId: string,
): Promise<{ isGameOver: boolean }> {
	const state = await repo.fetchGameState(db, userId);
	if (!state) throw new GameError("Game state not found", 404);
	if (state.remainTsumo > 0) throw new GameError("Ryukyoku is not allowed yet");

	const { shanten } = calculateShanten(state.tehai);
	const scoreDelta = shanten === 0 ? 3000 : shanten === 1 ? 1000 : 0;

	await recordKyoku(db, userId, { didAgari: false, shanten, scoreDelta });

	const { isGameOver } = await restartGame(db, userId);
	if (isGameOver) await repo.removeGameState(db, userId);
	return { isGameOver };
}

export function toGameState(record: GameStateRecord): GameState {
	return {
		kyoku: record.kyoku,
		junme: record.junme,
		remainTsumo: record.remainTsumo,
		score: record.score,
		nextTsumohai: record.haiyama.length > 1 ? record.haiyama[1] : null,
		sutehai: record.sutehai,
		tehai: record.tehai,
		tsumohai: record.tsumohai.length > 0 ? record.tsumohai[0] : null,
	};
}

export async function getGameOverData(
	db: DrizzleD1Database,
	userId: string,
): Promise<GameOverData> {
	const allKyoku = await repo.fetchKyokuByUser(db, userId);

	const totalKyoku = allKyoku.length;
	const agariCount = allKyoku.filter((k) => k.didAgari).length;
	const ryukyokuCount = totalKyoku - agariCount;
	const tenpaiCount = allKyoku.filter(
		(k) => !k.didAgari && k.shanten === 0,
	).length;
	const finalScore =
		25000 + allKyoku.reduce((sum, k) => sum + (k.scoreDelta ?? 0), 0);

	const totals = await repo.fetchAllUserScoreTotals(db);
	const topScore = totals[0]?.totalScore ?? finalScore;
	const userIndex = totals.findIndex((t) => t.userId === userId);
	const userTotalScore = totals[userIndex]?.totalScore ?? finalScore;
	const rank = userIndex === -1 ? totals.length + 1 : userIndex + 1;

	return {
		finalScore,
		rank,
		totalPlayers: totals.length,
		gapToTop: Math.max(0, topScore - userTotalScore),
		totalKyoku,
		agariCount,
		ryukyokuCount,
		tenpaiCount,
	};
}

export async function getScoreData(
	db: DrizzleD1Database,
	userId: string,
): Promise<ScoreData> {
	const records = await repo.fetchKyokuByUser(db, userId);
	const stats = await repo.fetchKyokuStatsByHaiyama(db);

	const statsByHaiyamaId = new Map(stats.map((s) => [s.haiyamaId, s]));

	const recordsWithStats: KyokuRecord[] = records.map((r) => {
		const stat = statsByHaiyamaId.get(r.haiyamaId);
		return {
			...r,
			playedCount: stat?.playedCount ?? 0,
			agariCount: stat?.agariCount ?? 0,
		};
	});

	const sessions = [];
	for (let i = 0; i < recordsWithStats.length; i += 4) {
		sessions.push({ records: recordsWithStats.slice(i, i + 4).reverse() });
	}

	return {
		sessions,
		totalScore:
			25000 + recordsWithStats.reduce((sum, r) => sum + (r.scoreDelta ?? 0), 0),
	};
}
