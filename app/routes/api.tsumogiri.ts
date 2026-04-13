import { redirect } from "react-router";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { tsumogiri } from "~/lib/game-service";
import type { Route } from "./+types/api.tsumogiri";

export async function action({ context, request }: Route.ActionArgs) {
	const env = context.cloudflare.env;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const db = getDB(env);

	try {
		await tsumogiri(db, session.user.id);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return new Response(errorMessage, { status: 400 });
	}

	return redirect("/play");
}
