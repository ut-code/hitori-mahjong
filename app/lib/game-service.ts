import { eq, notInArray, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { gameState, haiyama, kyoku } from "@/lib/db/schema";
import type { Hai } from "@/lib/hai/types";
import { sortTehai } from "@/lib/hai/types";
import type { GameState, GameStateRecord } from "@/lib/types";

export async function getGameState(
	db: DrizzleD1Database,
	userId: string,
): Promise<GameStateRecord | null> {
	const result = await db
		.select()
		.from(gameState)
		.where(eq(gameState.userId, userId))
		.get();

	return result ?? null;
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
	await db.delete(kyoku).where(eq(kyoku.userId, userId));

	await db
		.insert(gameState)
		.values({
			userId,
			kyoku: 1,
			junme: 1,
			remainTsumo: 18,
			score: 25000,
			haiyama: remainingHai,
			sutehai: [],
			tehai,
			tsumohai,
			haiyamaId,
		})
		.onConflictDoUpdate({
			target: gameState.userId,
			set: {
				kyoku: 1,
				junme: 1,
				remainTsumo: 18,
				score: 25000,
				haiyama: remainingHai,
				sutehai: [],
				tehai,
				tsumohai,
				haiyamaId,
			},
		});
}

export async function getRandomHaiyama(db: DrizzleD1Database, userId: string) {
	const playedHaiyama = await db
		.select({ haiyamaId: kyoku.haiyamaId })
		.from(kyoku)
		.where(eq(kyoku.userId, userId));

	const playedIds = playedHaiyama.map((r) => r.haiyamaId);

	if (playedIds.length > 0) {
		return await db
			.select()
			.from(haiyama)
			.where(notInArray(haiyama.id, playedIds))
			.orderBy(sql`RANDOM()`)
			.limit(1);
	}
	return await db.select().from(haiyama).orderBy(sql`RANDOM()`).limit(1);
}

export async function tedashi(
	db: DrizzleD1Database,
	userId: string,
	index: number,
) {
	const state = await getGameState(db, userId);
	if (!state) {
		throw new Error("Game not found");
	}
	if (state.tsumohai.length === 0) {
		throw new Error("No tsumohai to discard");
	}
	if (index < 0 || index >= state.tehai.length) {
		throw new Error("Invalid tile index");
	}

	const tsumohai = state.tsumohai[0];
	const sortedTehai = sortTehai(state.tehai);
	const discardedHai = sortedTehai[index];
	const remainingTehai = sortedTehai.filter((_, i) => i !== index);

	const newJunme = state.junme + 1;
	const newRemainTsumo = state.remainTsumo - 1;
	const newHaiyama = state.haiyama.slice(1);
	const newSutehai = [...state.sutehai, discardedHai];
	const newTehai = sortTehai([...remainingTehai, tsumohai]);
	const newTsumohai = newHaiyama.length > 0 ? [newHaiyama[0]] : [];

	await db
		.update(gameState)
		.set({
			junme: newJunme,
			remainTsumo: newRemainTsumo,
			haiyama: newHaiyama,
			sutehai: newSutehai,
			tehai: newTehai,
			tsumohai: newTsumohai,
		})
		.where(eq(gameState.userId, userId));
}

export async function tsumogiri(db: DrizzleD1Database, userId: string) {
	const state = await getGameState(db, userId);
	if (!state) {
		throw new Error("Game not found");
	}
	if (state.tsumohai.length === 0) {
		throw new Error("No tsumohai to discard");
	}

	const tsumohai = state.tsumohai[0];
	const newJunme = state.junme + 1;
	const newRemainTsumo = state.remainTsumo - 1;
	const newHaiyama = state.haiyama.slice(1);
	const newSutehai = [...state.sutehai, tsumohai];
	const newTsumohai = newHaiyama.length > 0 ? [newHaiyama[0]] : [];

	await db
		.update(gameState)
		.set({
			junme: newJunme,
			remainTsumo: newRemainTsumo,
			haiyama: newHaiyama,
			sutehai: newSutehai,
			tsumohai: newTsumohai,
		})
		.where(eq(gameState.userId, userId));
}

export async function jikyoku(db: DrizzleD1Database, userId: string) {
	const state = await getGameState(db, userId);
	if (!state) {
		throw new Error("Game not found");
	}

	await db
		.update(gameState)
		.set({
			kyoku: state.kyoku + 1,
		})
		.where(eq(gameState.userId, userId));
}

export async function restartGame(
	db: DrizzleD1Database,
	userId: string,
): Promise<{ newKyoku: number; isGameOver: boolean }> {
	const state = await getGameState(db, userId);
	if (!state) {
		throw new Error("Game not found");
	}

	const newKyoku = state.kyoku + 1;
	const isGameOver = newKyoku > 4;

	if (isGameOver) {
		return { newKyoku, isGameOver: true };
	}

	const randomHaiyama = await getRandomHaiyama(db, userId);

	const newHaiyama = randomHaiyama[0].tiles;
	const newHaiyamaId = randomHaiyama[0].id;

	const tehai = newHaiyama.slice(0, 13);
	const tsumohai = newHaiyama[13] ? [newHaiyama[13]] : [];
	const remainingHai = newHaiyama.slice(14);

	await db
		.update(gameState)
		.set({
			kyoku: newKyoku,
			junme: 1,
			remainTsumo: 18,
			haiyama: remainingHai,
			sutehai: [],
			tehai,
			tsumohai,
			haiyamaId: newHaiyamaId,
		})
		.where(eq(gameState.userId, userId));

	return { newKyoku, isGameOver: false };
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

/**
 * Record a game result in the kyoku table
 */
export async function recordKyoku(
	db: DrizzleD1Database,
	userId: string,
	options: {
		didAgari: boolean;
		agariJunme?: number;
		shanten: number;
		scoreDelta: number;
	},
): Promise<void> {
	const state = await getGameState(db, userId);
	if (!state) {
		throw new Error("Game not found");
	}

	if (!state.haiyamaId) {
		throw new Error("Haiyama ID not found");
	}

	// Insert into kyoku table
	await db.insert(kyoku).values({
		userId,
		haiyamaId: state.haiyamaId,
		didAgari: options.didAgari,
		agariJunme: options.agariJunme ?? null,
		shanten: options.shanten,
		scoreDelta: options.scoreDelta,
	});

	// Update score in game state
	await db
		.update(gameState)
		.set({ score: state.score + options.scoreDelta })
		.where(eq(gameState.userId, userId));

	// Recalculate average agari junme for this haiyama atomically
	// Uses a subquery to compute AVG in a single UPDATE, avoiding race conditions
	await db
		.update(haiyama)
		.set({
			avgAgariJunme: sql`COALESCE(
				(SELECT AVG(${kyoku.agariJunme}) FROM ${kyoku} WHERE ${kyoku.haiyamaId} = ${haiyama.id}),
				0
			)`,
		})
		.where(eq(haiyama.id, state.haiyamaId));
}
