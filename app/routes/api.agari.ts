import { redirect } from "react-router";
import { z } from "zod";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { getGameState, recordKyoku, restartGame } from "~/lib/game-service";
import type { Route } from "./+types/api.agari";

const agariSchema = z.object({
	junme: z.coerce.number().optional(),
});

export async function action({ context, request }: Route.ActionArgs) {
	const env = context.cloudflare.env;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const junme = formData.get("junme");
	const parsedData = agariSchema.safeParse({
		junme: junme === null || junme === "" ? undefined : junme,
	});
	if (!parsedData.success) {
		return new Response("Invalid form data", { status: 400 });
	}

	const db = getDB(env);
	const userId = session.user.id;
	const gameStateRecord = await getGameState(db, userId);
	if (!gameStateRecord) {
		return new Response("Game state not found", { status: 404 });
	}

	const agariJunme = parsedData.data.junme ?? gameStateRecord.junme;

	// Record win with +8000 points
	await recordKyoku(db, userId, {
		didAgari: true,
		agariJunme,
		shanten: 0,
		scoreDelta: 8000,
	});

	const { isGameOver } = await restartGame(db, userId);

	if (isGameOver) {
		return redirect("/gameover");
	}

	return redirect("/play");
}
