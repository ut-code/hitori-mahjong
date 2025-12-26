import { DurableObject } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import {
	type DrizzleSqliteDODatabase,
	drizzle,
} from "drizzle-orm/durable-sqlite";
import { migrate } from "drizzle-orm/durable-sqlite/migrator";
import { createRequestHandler } from "react-router";
import { gameState } from "../app/lib/db/schema-do";
import type { GameState } from "../app/lib/do";
import type { Hai } from "../app/lib/hai/utils";
import { sortTehai } from "../app/lib/hai/utils";
import migrations from "../drizzle-do/migrations";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

export class MyDurableObject extends DurableObject<Env> {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase;
	constructor(ctx: DurableObjectState, env: Env) {
		// Required, as we're extending the base class.
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, {
			logger: false,
		});

		ctx.blockConcurrencyWhile(async () => {
			console.log(migrations);
			await this._migrate();
		});
	}

	async _migrate() {
		migrate(this.db, migrations);
	}

	private async getGameState(): Promise<GameState | null> {
		const result = await this.db
			.select()
			.from(gameState)
			.where(eq(gameState.id, 1))
			.get();

		if (!result) {
			return null;
		}

		return {
			kyoku: result.kyoku,
			junme: result.junme,
			haiyama: result.haiyama,
			sutehai: result.sutehai,
			tehai: result.tehai,
			tsumohai: result.tsumohai,
		};
	}

	async init(initHaiyama: Hai[]) {
		const tehai = initHaiyama.slice(0, 13);
		const tsumohai = initHaiyama[13];
		const haiyama = initHaiyama.slice(14);

		await this.db
			.insert(gameState)
			.values({
				id: 1,
				kyoku: 1,
				junme: 1,
				haiyama,
				sutehai: [],
				tehai,
				tsumohai,
			})
			.onConflictDoUpdate({
				target: gameState.id,
				set: {
					kyoku: 1,
					junme: 1,
					haiyama,
					sutehai: [],
					tehai,
					tsumohai,
				},
			});
	}

	async tedashi(index: number) {
		const state = await this.getGameState();
		if (!state) {
			throw new Error("game not found");
		}
		if (!state.tsumohai) {
			throw new Error("syohai");
		}
		const tsumohai = state.tsumohai;

		if (index < 0 || 12 < index) {
			throw new Error("index out of tehai length");
		}
		const sortedTehai = sortTehai(state.tehai);
		const deletedTehai = sortedTehai.filter((_, i) => i !== index);
		const discardedHai = sortedTehai[index];

		await this.db
			.update(gameState)
			.set({
				junme: state.junme + 1,
				haiyama: state.haiyama.slice(1),
				sutehai: [...state.sutehai, discardedHai],
				tehai: sortTehai([...deletedTehai, tsumohai]),
				tsumohai: state.haiyama[0],
			})
			.where(eq(gameState.id, 1));
	}

	async tsumogiri() {
		const state = await this.getGameState();
		if (!state) {
			throw new Error("game not found");
		}
		if (!state.tsumohai) {
			throw new Error("syohai");
		}
		const tsumohai = state.tsumohai;

		await this.db
			.update(gameState)
			.set({
				junme: state.junme + 1,
				haiyama: state.haiyama.slice(1),
				sutehai: [...state.sutehai, tsumohai],
				tsumohai: state.haiyama[0],
			})
			.where(eq(gameState.id, 1));
	}

	async jikyoku() {
		const state = await this.getGameState();
		if (!state) {
			throw new Error("game not found");
		}

		await this.db
			.update(gameState)
			.set({
				kyoku: state.kyoku + 1,
			})
			.where(eq(gameState.id, 1));
	}

	async getCurrentGameState(): Promise<GameState | null> {
		return await this.getGameState();
	}

	async deleteGameState() {
		await this.db.delete(gameState).where(eq(gameState.id, 1));
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx) {
		return requestHandler(request, {
			cloudflare: { env, ctx },
		});
	},
} satisfies ExportedHandler<Env>;
