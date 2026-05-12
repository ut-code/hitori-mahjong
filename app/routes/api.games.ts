import { redirect } from "react-router";
import { getAuth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { getRandomHaiyama, initGame } from "@/lib/game-service";
import type { Route } from "./+types/api.games";

export async function action({ context, request }: Route.LoaderArgs) {
	const { env } = context.cloudflare;
	const db = getDB(env);
	const auth = getAuth(env);

	let session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user.id) {
		await auth.api.signInAnonymous({ headers: request.headers });
		session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user.id) {
			throw new Response("Unauthorized", { status: 401 });
		}
	}
	const userId = session.user.id;
	const randomHaiyama = await getRandomHaiyama(db, userId);
	const { id: haiyamaId, tiles: haiData } = randomHaiyama[0];
	await initGame(db, userId, haiyamaId, haiData);

	return redirect("/play");
}
