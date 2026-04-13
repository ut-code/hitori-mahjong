import { redirect } from "react-router";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { tedashi } from "~/lib/game";
import type { Route } from "./+types/play.tedashi";

export async function action({ context, request }: Route.ActionArgs) {
	const { env } = context.cloudflare;
	const db = getDB(env);
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	const formData = await request.formData();
	const index = Number(formData.get("index"));

	if (Number.isNaN(index)) {
		throw new Response("Invalid index", { status: 400 });
	}

	try {
		await tedashi(db, userId, index);
		return redirect("/play");
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Response(errorMessage, { status: 400 });
	}
}
