import { eq, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { gameState, haiyama } from "~/lib/db/schema";
import type { Hai } from "~/lib/hai/types";
import { sortTehai } from "~/lib/hai/types";
import type { GameState } from "~/lib/types";

export interface GameStateRecord {
	userId: string;
	kyoku: number;
	junme: number;
	haiyama: Hai[];
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai[];
	haiyamaId: string | null;
}

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

	await db
		.insert(gameState)
		.values({
			userId,
			kyoku: 1,
			junme: 1,
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
				haiyama: remainingHai,
				sutehai: [],
				tehai,
				tsumohai,
				haiyamaId,
			},
		});
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
	const newHaiyama = state.haiyama.slice(1);
	const newSutehai = [...state.sutehai, discardedHai];
	const newTehai = sortTehai([...remainingTehai, tsumohai]);
	const newTsumohai = newHaiyama.length > 0 ? [newHaiyama[0]] : [];

	await db
		.update(gameState)
		.set({
			junme: newJunme,
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
	const newHaiyama = state.haiyama.slice(1);
	const newSutehai = [...state.sutehai, tsumohai];
	const newTsumohai = newHaiyama.length > 0 ? [newHaiyama[0]] : [];

	await db
		.update(gameState)
		.set({
			junme: newJunme,
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
): Promise<{ newKyoku: number }> {
	const state = await getGameState(db, userId);
	if (!state) {
		throw new Error("Game not found");
	}

	const randomHaiyama = await db
		.select()
		.from(haiyama)
		.orderBy(sql`RANDOM()`)
		.limit(1);

	if (randomHaiyama.length === 0) {
		throw new Error("No haiyama found");
	}

	const newHaiyama = randomHaiyama[0].tiles;
	const newHaiyamaId = randomHaiyama[0].id;
	const newKyoku = state.kyoku + 1;

	await initGame(db, userId, newHaiyamaId, newHaiyama);

	await db
		.update(gameState)
		.set({ kyoku: newKyoku })
		.where(eq(gameState.userId, userId));

	return { newKyoku };
}

export function toGameState(record: GameStateRecord): GameState {
	return {
		kyoku: record.kyoku,
		junme: record.junme,
		haiyama: record.haiyama,
		sutehai: record.sutehai,
		tehai: record.tehai,
		tsumohai: record.tsumohai.length > 0 ? record.tsumohai[0] : null,
	};
}
