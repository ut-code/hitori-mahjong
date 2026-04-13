import { redirect } from "react-router";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { tsumogiri } from "~/lib/game";
import type { Route } from "./+types/play.tsumogiri";

export async function action({ context, request }: Route.ActionArgs) {
	const { env } = context.cloudflare;
	const db = getDB(env);
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	try {
		await tsumogiri(db, userId);
		return redirect("/play");
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Response(errorMessage, { status: 400 });
	}
}
