import { notFound, redirect } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import { z } from "zod";
import { getSessionUserId } from "@/lib/service/auth";
import { getDB } from "@/lib/service/db";
import {
  GameError,
  getGameOverData,
  getGameState,
  getScoreData,
  performAgari,
  performRyukyoku,
  startNewGame,
  tedashi,
  toGameState,
  tsumogiri,
} from "./service";

async function requireUserId() {
  const userId = await getSessionUserId();
  if (!userId) throw new GameError("Unauthorized", 401);
  return userId;
}

export const startGameFn = createServerFn({ method: "POST" }).handler(async () => {
  await startNewGame(getDB(), await requireUserId());
});

export const getPlayStateFn = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getSessionUserId();
  if (!userId) throw redirect({ to: "/" });
  const state = await getGameState(getDB(), userId);
  if (!state) throw redirect({ to: "/" });
  return toGameState(state);
});

const discardSchema = z.discriminatedUnion("intent", [
  z.object({ intent: z.literal("tedashi"), index: z.number().int().min(0) }),
  z.object({ intent: z.literal("tsumogiri") }),
]);

export const discardFn = createServerFn({ method: "POST" })
  .validator(discardSchema)
  .handler(async ({ data }) => {
    const db = getDB();
    const userId = await requireUserId();
    const state = await getGameState(db, userId);
    // 流局後に古い画面から打牌が届くと残りツモが負になるため、ここで弾く
    if (state && state.remainTsumo <= 0) throw new GameError("Ryukyoku already reached");
    if (data.intent === "tedashi") await tedashi(db, userId, data.index);
    else await tsumogiri(db, userId);
    const latest = await getGameState(db, userId);
    if (!latest) throw notFound();
    return toGameState(latest);
  });

const finishKyokuSchema = z.object({
  intent: z.enum(["agari", "ryukyoku"]),
});

export const finishKyokuFn = createServerFn({ method: "POST" })
  .validator(finishKyokuSchema)
  .handler(async ({ data }) => {
    const db = getDB();
    const userId = await requireUserId();
    return data.intent === "agari" ? performAgari(db, userId) : performRyukyoku(db, userId);
  });

export const getGameOverFn = createServerFn({ method: "GET" }).handler(async () =>
  getGameOverData(getDB(), await requireUserId()),
);

export const getScoreFn = createServerFn({ method: "GET" }).handler(async () =>
  getScoreData(getDB(), await requireUserId()),
);
