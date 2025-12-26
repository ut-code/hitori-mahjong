import { redirect } from "react-router";
import { getAuth } from "~/lib/auth";
import getDOStub from "~/lib/do";
import type { Route } from "./+types/play.tsumogiri";

export async function action({ context, request }: Route.ActionArgs) {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	const stub = getDOStub(env, userId);

	try {
		await stub.tsumogiri();

		return redirect("/play");
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Response(errorMessage, { status: 400 });
	}
}
