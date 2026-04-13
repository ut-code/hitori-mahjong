import { redirect } from "react-router";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { getGameState, tsumogiri } from "~/lib/game-service";
import type { Route } from "./+types/api.tsumogiri";

export async function action({ context, request }: Route.ActionArgs) {
	const env = context.cloudflare.env;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const db = getDB(env);
	const userId = session.user.id;

	// Check if we have tsumo remaining
	const gameStateRecord = await getGameState(db, userId);
	if (gameStateRecord && gameStateRecord.remainTsumo <= 0) {
		// No more tsumo - force ryukyoku
		return redirect("/play?ryukyoku=1");
	}

	try {
		await tsumogiri(db, userId);
	} catch {
		return new Response("Invalid request", { status: 400 });
	}

	return redirect("/play");
}
