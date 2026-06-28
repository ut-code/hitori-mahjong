import { desc, eq, notInArray, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { gameState, haiyama, kyoku } from "@/db/schema";
import type { Hai } from "@/types/hai";

export type GameStateValues = {
	kyoku: number;
	junme: number;
	remainTsumo: number;
	score: number;
	haiyama: Hai[];
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai[];
	haiyamaId: string | null;
};

export type KyokuInsert = {
	userId: string;
	haiyamaId: string;
	didAgari: boolean;
	agariJunme?: number | null;
	shanten: number;
	scoreDelta: number;
};

export async function fetchGameState(db: DrizzleD1Database, userId: string) {
	const result = await db
		.select()
		.from(gameState)
		.where(eq(gameState.userId, userId))
		.get();
	return result ?? null;
}

export async function upsertGameState(
	db: DrizzleD1Database,
	userId: string,
	values: GameStateValues,
) {
	await db
		.insert(gameState)
		.values({ userId, ...values })
		.onConflictDoUpdate({ target: gameState.userId, set: values });
}

export async function patchGameState(
	db: DrizzleD1Database,
	userId: string,
	values: Partial<GameStateValues>,
) {
	await db.update(gameState).set(values).where(eq(gameState.userId, userId));
}

export async function removeGameState(db: DrizzleD1Database, userId: string) {
	await db.delete(gameState).where(eq(gameState.userId, userId));
}

export async function fetchPlayedHaiyamaIds(
	db: DrizzleD1Database,
	userId: string,
): Promise<string[]> {
	const rows = await db
		.select({ haiyamaId: kyoku.haiyamaId })
		.from(kyoku)
		.where(eq(kyoku.userId, userId));
	return rows.map((r) => r.haiyamaId);
}

export async function fetchRandomHaiyama(
	db: DrizzleD1Database,
	excludeIds: string[] = [],
) {
	if (excludeIds.length > 0) {
		return db
			.select()
			.from(haiyama)
			.where(notInArray(haiyama.id, excludeIds))
			.orderBy(sql`RANDOM()`)
			.limit(1);
	}
	return db.select().from(haiyama).orderBy(sql`RANDOM()`).limit(1);
}

export async function clearKyokuByUser(db: DrizzleD1Database, userId: string) {
	await db.delete(kyoku).where(eq(kyoku.userId, userId));
}

export async function insertKyokuRecord(
	db: DrizzleD1Database,
	values: KyokuInsert,
) {
	await db.insert(kyoku).values(values);
}

export async function refreshHaiyamaStats(
	db: DrizzleD1Database,
	haiyamaId: string,
) {
	await db
		.update(haiyama)
		.set({
			avgAgariJunme: sql`COALESCE(
				(SELECT AVG(${kyoku.agariJunme}) FROM ${kyoku} WHERE ${kyoku.haiyamaId} = ${haiyama.id}),
				0
			)`,
		})
		.where(eq(haiyama.id, haiyamaId));
}

export async function fetchKyokuByUser(db: DrizzleD1Database, userId: string) {
	return db
		.select()
		.from(kyoku)
		.where(eq(kyoku.userId, userId))
		.orderBy(desc(kyoku.createdAt));
}

export async function fetchAllUserScoreTotals(db: DrizzleD1Database) {
	return db
		.select({
			userId: kyoku.userId,
			totalScore: sql<number>`25000 + coalesce(sum(${kyoku.scoreDelta}), 0)`,
		})
		.from(kyoku)
		.groupBy(kyoku.userId)
		.orderBy(desc(sql<number>`25000 + coalesce(sum(${kyoku.scoreDelta}), 0)`));
}

export async function fetchKyokuStatsByHaiyama(db: DrizzleD1Database) {
	return db
		.select({
			haiyamaId: kyoku.haiyamaId,
			playedCount: sql<number>`count(*)`,
			agariCount: sql<number>`coalesce(sum(case when ${kyoku.didAgari} then 1 else 0 end), 0)`,
		})
		.from(kyoku)
		.groupBy(kyoku.haiyamaId);
}
