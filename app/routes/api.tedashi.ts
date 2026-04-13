import { redirect } from "react-router";
import { z } from "zod";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { getGameState, tedashi } from "~/lib/game-service";
import type { Route } from "./+types/api.tedashi";

const tedashiSchema = z.object({
	index: z.coerce.number().int().min(0),
});

export async function action({ context, request }: Route.ActionArgs) {
	const env = context.cloudflare.env;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const parsedData = tedashiSchema.safeParse({
		index: formData.get("index"),
	});
	if (!parsedData.success) {
		return new Response("Invalid form data", { status: 400 });
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
		await tedashi(db, userId, parsedData.data.index);
	} catch {
		return new Response("Invalid request", { status: 400 });
	}

	return redirect("/play");
}
