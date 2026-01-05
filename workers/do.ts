import { DurableObject } from "cloudflare:workers";
import type { GameState } from "../app/lib/do";
import type { Hai } from "../app/lib/hai/utils";
import { sortTehai } from "../app/lib/hai/utils";

export class MyDurableObject extends DurableObject<Env> {
	private gameState: GameState;
	constructor(ctx: DurableObjectState, env: Env) {
		// Required, as we're extending the base class.
		super(ctx, env);
		this.gameState = {
			kyoku: 0,
			junme: 0,
			haiyama: [],
			sutehai: [],
			tehai: [],
			tsumohai: null,
		};

		ctx.blockConcurrencyWhile(async () => {
			const saved = await this.ctx.storage.get<GameState>("gameState");
			if (saved) this.gameState = saved;
		});
	}

	async getGameState(): Promise<GameState> {
		return this.gameState;
	}

	async init(initHaiyama: Hai[]) {
		const tehai = initHaiyama.slice(0, 13);
		const tsumohai = initHaiyama[13];
		const haiyama = initHaiyama.slice(14);
		this.gameState.kyoku = 1;
		this.gameState.junme = 1;
		this.gameState.haiyama = haiyama;
		this.gameState.sutehai = [];
		this.gameState.tehai = tehai;
		this.gameState.tsumohai = tsumohai;
		await this.ctx.storage.put("gameState", this.gameState);
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
		const remainingTehai = sortedTehai.filter((_, i) => i !== index);
		const discardedHai = sortedTehai[index];

		this.gameState.junme = state.junme + 1;
		this.gameState.haiyama = state.haiyama.slice(1);
		this.gameState.sutehai = [...state.sutehai, discardedHai];
		this.gameState.tehai = sortTehai([...remainingTehai, tsumohai]);
		this.gameState.tsumohai = state.haiyama[0];
		await this.ctx.storage.put("gameState", this.gameState);
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

		this.gameState.junme = state.junme + 1;
		this.gameState.haiyama = state.haiyama.slice(1);
		this.gameState.sutehai = [...state.sutehai, tsumohai];
		this.gameState.tsumohai = state.haiyama[0];
		await this.ctx.storage.put("gameState", this.gameState);
	}

	async jikyoku() {
		const state = await this.getGameState();
		if (!state) {
			throw new Error("game not found");
		}
		this.gameState.kyoku = state.kyoku + 1;
		await this.ctx.storage.put("gameState", this.gameState);
	}
}
