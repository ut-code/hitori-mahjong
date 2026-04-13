import { createRequestHandler } from "react-router";
import apiApp from "./api";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/api/")) {
			return apiApp.fetch(request, {
				DB: env.DB,
				VALUE_FROM_CLOUDFLARE: env.VALUE_FROM_CLOUDFLARE,
			});
		}
		return requestHandler(request, {
			cloudflare: { env, ctx },
		});
	},
} satisfies ExportedHandler<Env>;
