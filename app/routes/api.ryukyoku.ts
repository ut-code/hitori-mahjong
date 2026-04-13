import { redirect } from "react-router";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { getGameState, recordKyoku, restartGame } from "~/lib/game-service";
import { calculateShanten } from "~/lib/hai/shanten";
import type { Route } from "./+types/api.ryukyoku";

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

	// Calculate shanten for current hand
	const shantenResult = calculateShanten(gameStateRecord.tehai);
	const shanten = shantenResult.shanten;

	// Determine score based on shanten
	let scoreDelta = 0;
	if (shanten === 0) {
		scoreDelta = 3000; // Tenpai
	} else if (shanten === 1) {
		scoreDelta = 1000; // Iishanten
	}

	// Record ryukyoku
	await recordKyoku(db, userId, {
		didAgari: false,
		shanten,
		scoreDelta,
	});

	const { isGameOver } = await restartGame(db, userId);

	if (isGameOver) {
		return redirect("/gameover");
	}

	return redirect("/play");
}
