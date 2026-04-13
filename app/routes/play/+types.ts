import type { GameState } from "~/lib/types";

export namespace Route {
	export type ComponentProps = {
		loaderData: GameState;
		actionData?: unknown;
	};
	export type LoaderArgs = {
		request: Request;
		params: Record<string, string | undefined>;
		context: {
			cloudflare: {
				env: Env;
				ctx: ExecutionContext;
			};
		};
	};
	export type ActionArgs = LoaderArgs;
}
