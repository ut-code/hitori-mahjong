import { redirect } from "react-router";
import { z } from "zod";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { tedashi } from "~/lib/game-service";
import type { Route } from "./+types/api.tedashi";

const tedashiSchema = z.object({
	index: z.coerce.number(),
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

	try {
		await tedashi(db, session.user.id, parsedData.data.index);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return new Response(errorMessage, { status: 400 });
	}

	return redirect("/play");
}
