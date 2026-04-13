import { redirect } from "react-router";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { kyoku } from "~/lib/db/schema";
import { getGameState, restartGame } from "~/lib/game";
import type { Route } from "./+types/api.ryukyoku";

export async function action({ context, request }: Route.ActionArgs) {
	const { env } = context.cloudflare;
	const db = getDB(env);
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	// Get current game state to record the result
	const gameStateRecord = await getGameState(db, userId);
	if (!gameStateRecord) {
		throw new Response("Game state not found", { status: 404 });
	}

	// Record the ryukyoku (draw) in the database
	await db.insert(kyoku).values({
		userId,
		haiyamaId: gameStateRecord.haiyamaId ?? "",
		didAgari: false,
		agariJunme: null,
	});

	// Start a new game
	await restartGame(db, userId);

	// Redirect to play page
	return redirect("/play");
}
