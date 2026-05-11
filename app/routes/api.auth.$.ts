import { getAuth } from "@/lib/auth";
import type { Route } from "./+types/api.auth.$";

async function handleAuth(
	args: Pick<Route.LoaderArgs, "context" | "request">,
): Promise<Response> {
	const auth = getAuth(args.context.cloudflare.env);
	return auth.handler(args.request);
}

export async function loader(args: Route.LoaderArgs): Promise<Response> {
	return handleAuth(args);
}

export async function action(args: Route.ActionArgs): Promise<Response> {
	return handleAuth(args);
}
