import { hc } from "hono/client";
import type { ApiApp } from "~/../workers/api";

export const client = hc<ApiApp>("", {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init),
});
