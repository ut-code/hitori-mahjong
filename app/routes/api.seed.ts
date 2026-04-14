import { sql } from "drizzle-orm";
import { z } from "zod";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { haiyama } from "~/lib/db/schema";
import { seedHaiyama } from "~/lib/game-service";
import type { Route } from "./+types/api.seed";

const seedSchema = z.object({
	count: z.coerce.number().int().min(1).max(500).default(50),
});

async function ensureSession(request: Request, env: Env) {
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) {
		return null;
	}
	return session;
}

async function seedAndRespond(env: Env, countInput: unknown) {
	const parsed = seedSchema.safeParse({ count: countInput });
	if (!parsed.success) {
		return new Response("Invalid count (1-500)", { status: 400 });
	}

	const db = getDB(env);
	await seedHaiyama(db, parsed.data.count);

	const total = await db
		.select({ count: sql<number>`count(*)` })
		.from(haiyama)
		.get();

	return Response.json({
		seeded: parsed.data.count,
		total: total?.count ?? 0,
	});
}

export async function loader(_: Route.LoaderArgs) {
	return new Response("Method Not Allowed", {
		status: 405,
		headers: { Allow: "POST" },
	});
}

export async function action({ context, request }: Route.ActionArgs) {
	const env = context.cloudflare.env;
	const session = await ensureSession(request, env);
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	return seedAndRespond(env, formData.get("count") ?? undefined);
}
