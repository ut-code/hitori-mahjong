import { desc, eq, notInArray, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import judgeAgari from "@/lib/core/agari";
import { sortTehai } from "@/lib/core/hai";
import { getAgariScoreDelta } from "@/lib/core/score";
import { calculateShanten } from "@/lib/core/shanten";
import type {
  GameOverData,
  GameState,
  GameStateRecord,
  KyokuRecord,
  ScoreData,
} from "@/lib/core/types/game";
import type { Hai } from "@/lib/core/types/hai";
import { gameState, haiyama, kyoku } from "@/lib/service/db/schema";

type DB = DrizzleD1Database;

export class GameError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = "GameError";
  }
}

export async function getGameState(db: DB, userId: string): Promise<GameStateRecord | null> {
  const result = await db.select().from(gameState).where(eq(gameState.userId, userId)).get();
  return result ?? null;
}

async function requireGameState(db: DB, userId: string) {
  const state = await getGameState(db, userId);
  if (!state) throw new GameError("Game not found", 404);
  return state;
}

async function patchGameState(
  db: DB,
  userId: string,
  values: Partial<typeof gameState.$inferInsert>,
) {
  await db.update(gameState).set(values).where(eq(gameState.userId, userId));
}

// 同じ牌山を何度も配らないため、そのユーザーがまだ遊んでいない牌山から選ぶ
async function pickRandomHaiyama(db: DB, userId: string) {
  const played = await db
    .select({ haiyamaId: kyoku.haiyamaId })
    .from(kyoku)
    .where(eq(kyoku.userId, userId));
  const playedIds = played.map((r) => r.haiyamaId);
  const [picked] = await db
    .select()
    .from(haiyama)
    .where(playedIds.length > 0 ? notInArray(haiyama.id, playedIds) : undefined)
    .orderBy(sql`RANDOM()`)
    .limit(1);
  if (!picked) throw new GameError("No haiyama available", 404);
  return picked;
}

function dealKyoku(haiyamaId: string, tiles: Hai[]) {
  return {
    junme: 1,
    remainTsumo: 18,
    haiyama: tiles.slice(14),
    sutehai: [],
    tehai: tiles.slice(0, 13),
    tsumohai: tiles[13] ? [tiles[13]] : [],
    haiyamaId,
  };
}

export async function startNewGame(db: DB, userId: string) {
  const { id, tiles } = await pickRandomHaiyama(db, userId);
  const values = { kyoku: 1, score: 25000, ...dealKyoku(id, tiles) };
  await db.delete(kyoku).where(eq(kyoku.userId, userId));
  await db
    .insert(gameState)
    .values({ userId, ...values })
    .onConflictDoUpdate({ target: gameState.userId, set: values });
}

export async function tedashi(db: DB, userId: string, index: number) {
  const state = await requireGameState(db, userId);
  if (state.tsumohai.length === 0) throw new GameError("No tsumohai to discard");
  if (index < 0 || index >= state.tehai.length) throw new GameError("Invalid tile index");

  const sortedTehai = sortTehai(state.tehai);
  const newHaiyama = state.haiyama.slice(1);
  await patchGameState(db, userId, {
    junme: state.junme + 1,
    remainTsumo: state.remainTsumo - 1,
    haiyama: newHaiyama,
    sutehai: [...state.sutehai, sortedTehai[index]],
    tehai: sortTehai([...sortedTehai.filter((_, i) => i !== index), state.tsumohai[0]]),
    tsumohai: newHaiyama.length > 0 ? [newHaiyama[0]] : [],
  });
}

export async function tsumogiri(db: DB, userId: string) {
  const state = await requireGameState(db, userId);
  if (state.tsumohai.length === 0) throw new GameError("No tsumohai to discard");

  const newHaiyama = state.haiyama.slice(1);
  await patchGameState(db, userId, {
    junme: state.junme + 1,
    remainTsumo: state.remainTsumo - 1,
    haiyama: newHaiyama,
    sutehai: [...state.sutehai, state.tsumohai[0]],
    tsumohai: newHaiyama.length > 0 ? [newHaiyama[0]] : [],
  });
}

// 局の結果を記録し、次の局を配る。4 局終わっていたらゲーム状態を消して終局を返す
async function finishKyoku(
  db: DB,
  userId: string,
  state: GameStateRecord,
  result: {
    didAgari: boolean;
    agariJunme?: number;
    shanten: number;
    scoreDelta: number;
  },
): Promise<{ isGameOver: boolean }> {
  const haiyamaId = state.haiyamaId;
  if (!haiyamaId) throw new GameError("Haiyama ID not found");

  await db.insert(kyoku).values({
    userId,
    haiyamaId,
    didAgari: result.didAgari,
    agariJunme: result.agariJunme ?? null,
    shanten: result.shanten,
    scoreDelta: result.scoreDelta,
  });
  await db
    .update(haiyama)
    .set({
      avgAgariJunme: sql`COALESCE(
				(SELECT AVG(${kyoku.agariJunme}) FROM ${kyoku} WHERE ${kyoku.haiyamaId} = ${haiyama.id}),
				0
			)`,
    })
    .where(eq(haiyama.id, haiyamaId));

  if (state.kyoku >= 4) {
    await db.delete(gameState).where(eq(gameState.userId, userId));
    return { isGameOver: true };
  }

  const { id, tiles } = await pickRandomHaiyama(db, userId);
  await patchGameState(db, userId, {
    kyoku: state.kyoku + 1,
    score: state.score + result.scoreDelta,
    ...dealKyoku(id, tiles),
  });
  return { isGameOver: false };
}

export async function performAgari(db: DB, userId: string) {
  const state = await requireGameState(db, userId);
  const tsumohai = state.tsumohai[0];
  if (!tsumohai) throw new GameError("No tile drawn - cannot declare win");
  if (!judgeAgari(sortTehai([...state.tehai, tsumohai])))
    throw new GameError("Hand does not form a valid winning combination");

  return finishKyoku(db, userId, state, {
    didAgari: true,
    agariJunme: state.junme,
    shanten: 0,
    scoreDelta: getAgariScoreDelta(state.junme),
  });
}

export async function performRyukyoku(db: DB, userId: string) {
  const state = await requireGameState(db, userId);
  if (state.remainTsumo > 0) throw new GameError("Ryukyoku is not allowed yet");

  const { shanten } = calculateShanten(state.tehai);
  return finishKyoku(db, userId, state, {
    didAgari: false,
    shanten,
    scoreDelta: shanten === 0 ? 3000 : shanten === 1 ? 1000 : 0,
  });
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

function fetchKyokuByUser(db: DB, userId: string) {
  return db.select().from(kyoku).where(eq(kyoku.userId, userId)).orderBy(desc(kyoku.createdAt));
}

const totalScore = sql<number>`25000 + coalesce(sum(${kyoku.scoreDelta}), 0)`;

export async function getGameOverData(db: DB, userId: string): Promise<GameOverData> {
  const allKyoku = await fetchKyokuByUser(db, userId);

  const totalKyoku = allKyoku.length;
  const agariCount = allKyoku.filter((k) => k.didAgari).length;
  const tenpaiCount = allKyoku.filter((k) => !k.didAgari && k.shanten === 0).length;
  const finalScore = 25000 + allKyoku.reduce((sum, k) => sum + (k.scoreDelta ?? 0), 0);

  const totals = await db
    .select({ userId: kyoku.userId, totalScore })
    .from(kyoku)
    .groupBy(kyoku.userId)
    .orderBy(desc(totalScore));
  const topScore = totals[0]?.totalScore ?? finalScore;
  const userIndex = totals.findIndex((t) => t.userId === userId);
  const userTotalScore = totals[userIndex]?.totalScore ?? finalScore;

  return {
    finalScore,
    rank: userIndex === -1 ? totals.length + 1 : userIndex + 1,
    totalPlayers: totals.length,
    gapToTop: Math.max(0, topScore - userTotalScore),
    totalKyoku,
    agariCount,
    ryukyokuCount: totalKyoku - agariCount,
    tenpaiCount,
  };
}

export async function getScoreData(db: DB, userId: string): Promise<ScoreData> {
  const records = await fetchKyokuByUser(db, userId);
  const stats = await db
    .select({
      haiyamaId: kyoku.haiyamaId,
      playedCount: sql<number>`count(*)`,
      agariCount: sql<number>`coalesce(sum(case when ${kyoku.didAgari} then 1 else 0 end), 0)`,
    })
    .from(kyoku)
    .groupBy(kyoku.haiyamaId);
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
    totalScore: 25000 + recordsWithStats.reduce((sum, r) => sum + (r.scoreDelta ?? 0), 0),
  };
}
