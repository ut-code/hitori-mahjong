import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getAuth } from "../app/lib/auth";
import { getDB } from "../app/lib/db";
import { kyoku } from "../app/lib/db/schema";
import {
	getGameState,
	restartGame,
	tedashi,
	tsumogiri,
} from "../app/lib/game-service";

const agariSchema = z.object({
	junme: z.coerce.number().optional(),
});

const tedashiSchema = z.object({
	index: z.coerce.number(),
});

const app = new Hono<{
	Bindings: Cloudflare.Env;
	Variables: {
		userId: string;
	};
}>();

// Auth middleware
app.use("/*", async (c, next) => {
	if (c.req.path === "/auth" || c.req.path.startsWith("/auth/")) {
		await next();
		return;
	}

	const auth = getAuth(c.env);
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session?.user?.id) {
		return c.text("Unauthorized", 401);
	}

	c.set("userId", session.user.id);
	await next();
});

// Game routes
app.post("/agari", zValidator("form", agariSchema), async (c) => {
	const db = getDB(c.env);
	const userId = c.get("userId");
	const data = c.req.valid("form");

	const gameStateRecord = await getGameState(db, userId);
	if (!gameStateRecord) {
		return c.text("Game state not found", 404);
	}

	await db.insert(kyoku).values({
		userId,
		haiyamaId: gameStateRecord.haiyamaId ?? "",
		didAgari: true,
		agariJunme: data.junme ?? gameStateRecord.junme,
	});

	await restartGame(db, userId);

	return c.redirect("/play");
});

app.post("/ryukyoku", async (c) => {
	const db = getDB(c.env);
	const userId = c.get("userId");

	const gameStateRecord = await getGameState(db, userId);
	if (!gameStateRecord) {
		return c.text("Game state not found", 404);
	}

	await db.insert(kyoku).values({
		userId,
		haiyamaId: gameStateRecord.haiyamaId ?? "",
		didAgari: false,
		agariJunme: null,
	});

	await restartGame(db, userId);

	return c.redirect("/play");
});

app.post("/tedashi", zValidator("form", tedashiSchema), async (c) => {
	const db = getDB(c.env);
	const userId = c.get("userId");
	const data = c.req.valid("form");

	try {
		await tedashi(db, userId, data.index);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.text(errorMessage, 400);
	}

	return c.redirect("/play");
});

app.post("/tsumogiri", async (c) => {
	const db = getDB(c.env);
	const userId = c.get("userId");

	try {
		await tsumogiri(db, userId);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return c.text(errorMessage, 400);
	}

	return c.redirect("/play");
});

// Better-Auth handler (catch-all for /api/auth/*)
const authApp = new Hono<{ Bindings: Cloudflare.Env }>();

authApp.all("/*", async (c) => {
	const auth = getAuth(c.env);
	return auth.handler(c.req.raw);
});

app.route("/auth", authApp);

export default app;

export type ApiApp = typeof app;
