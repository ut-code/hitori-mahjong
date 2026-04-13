import { redirect } from "react-router";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { getGameState, recordKyoku, restartGame } from "~/lib/game-service";
import judgeAgari from "~/lib/hai/agari";
import { sortTehai } from "~/lib/hai/types";
import type { Route } from "./+types/api.agari";

export async function action({ context, request }: Route.ActionArgs) {
	const env = context.cloudflare.env;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const db = getDB(env);
	const userId = session.user.id;
	const gameStateRecord = await getGameState(db, userId);
	if (!gameStateRecord) {
		return new Response("Game state not found", { status: 404 });
	}

	const tsumohai = gameStateRecord.tsumohai[0];
	if (!tsumohai) {
		return new Response("Invalid agari request", { status: 400 });
	}
	const canAgari = judgeAgari(sortTehai([...gameStateRecord.tehai, tsumohai]));
	if (!canAgari) {
		return new Response("Invalid agari request", { status: 400 });
	}

	// Record win with +8000 points
	await recordKyoku(db, userId, {
		didAgari: true,
		agariJunme: gameStateRecord.junme,
		shanten: 0,
		scoreDelta: 8000,
	});

	const { isGameOver } = await restartGame(db, userId);

	if (isGameOver) {
		return redirect("/gameover");
	}

	return redirect("/play");
}
