import { eq, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { gameState, haiyama, kyoku } from "~/lib/db/schema";
import type { Hai } from "~/lib/hai/types";
import { sortTehai } from "~/lib/hai/types";
import type { GameState } from "~/lib/types";

export interface GameStateRecord {
	userId: string;
	kyoku: number;
	junme: number;
	remainTsumo: number;
	score: number;
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

/**
 * Create a shuffled haiyama with only suited tiles (no jihai)
 * Each haiyama has exactly `tileCount` tiles (default 32)
 */
export function createShuffledHaiyama(tileCount = 32): Hai[] {
	const tiles: Hai[] = [];

	for (const kind of ["manzu", "pinzu", "souzu"] as const) {
		for (let value = 1; value <= 9; value += 1) {
			for (let i = 0; i < 4; i += 1) {
				tiles.push({ kind, value });
			}
		}
	}

	// Shuffle
	for (let i = tiles.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[tiles[i], tiles[j]] = [tiles[j], tiles[i]];
	}

	return tiles.slice(0, tileCount);
}

export async function getRandomHaiyamaOrCreate(db: DrizzleD1Database) {
	const randomHaiyama = await db
		.select()
		.from(haiyama)
		.orderBy(sql`RANDOM()`)
		.limit(1);

	if (randomHaiyama.length > 0) {
		return randomHaiyama[0];
	}

	const generatedTiles = createShuffledHaiyama();
	await db.insert(haiyama).values({ tiles: generatedTiles });

	const insertedHaiyama = await db
		.select()
		.from(haiyama)
		.orderBy(sql`RANDOM()`)
		.limit(1);

	if (insertedHaiyama.length === 0) {
		throw new Error("Failed to create haiyama");
	}

	return insertedHaiyama[0];
}

export async function seedHaiyama(db: DrizzleD1Database, count: number) {
	const values = Array.from({ length: count }, () => ({
		tiles: createShuffledHaiyama(32),
	}));
	await db.insert(haiyama).values(values);
	return count;
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

	const randomHaiyama = await getRandomHaiyamaOrCreate(db);

	const newHaiyama = randomHaiyama.tiles;
	const newHaiyamaId = randomHaiyama.id;

	await initGame(db, userId, newHaiyamaId, newHaiyama);

	await db
		.update(gameState)
		.set({ kyoku: newKyoku })
		.where(eq(gameState.userId, userId));

	return { newKyoku, isGameOver: false };
}

export function toGameState(record: GameStateRecord): GameState {
	return {
		kyoku: record.kyoku,
		junme: record.junme,
		remainTsumo: record.remainTsumo,
		score: record.score,
		haiyama: record.haiyama,
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
