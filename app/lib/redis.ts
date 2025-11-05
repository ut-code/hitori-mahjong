import { createClient } from "redis";
import type { Hai } from "./hai";
import { sortTehai } from "./hai";

export function getRedisClient(env: Env) {
	const client = createClient({
		url: env.REDIS_URL,
	});
	return client;
}

interface GameState {
	kyoku: number;
	junme: number;
	haiyama: Hai[];
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai | null;
}

const getGameState = async (
	client: ReturnType<typeof createClient>,
	userId: string,
): Promise<GameState | null> => {
	const gameStateJSON = await client.get(`user:${userId}:game`);
	if (!gameStateJSON) {
		return null;
	}
	return JSON.parse(gameStateJSON);
};

const setGameState = async (
	client: ReturnType<typeof createClient>,
	userId: string,
	gameState: GameState,
) => {
	await client.set(`user:${userId}:game`, JSON.stringify(gameState));
};

export const init = async (
	client: ReturnType<typeof createClient>,
	userId: string,
	initHaiyama: Hai[],
) => {
	const tehai = initHaiyama.slice(0, 13);
	const tsumohai = initHaiyama[13];
	const haiyama = initHaiyama.slice(14);
	const initialGameState: GameState = {
		kyoku: 1,
		junme: 1,
		haiyama,
		sutehai: [],
		tehai,
		tsumohai,
	};
	await setGameState(client, userId, initialGameState);
};

export const tedashi = async (
	client: ReturnType<typeof createClient>,
	userId: string,
	index: number,
) => {
	const state = await getGameState(client, userId);
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
	const deletedTehai = state.tehai.filter((_, i) => i !== index);
	const discardedHai = state.tehai[index];

	const newGameState: GameState = {
		...state,
		junme: state.junme + 1,
		haiyama: state.haiyama.slice(1),
		sutehai: [...state.sutehai, discardedHai],
		tehai: sortTehai([...deletedTehai, tsumohai]),
		tsumohai: state.haiyama[0],
	};
	await setGameState(client, userId, newGameState);
};

export const tsumogiri = async (
	client: ReturnType<typeof createClient>,
	userId: string,
) => {
	const state = await getGameState(client, userId);
	if (!state) {
		throw new Error("game not found");
	}
	if (!state.tsumohai) {
		throw new Error("syohai");
	}
	const tsumohai = state.tsumohai;
	const newGameState: GameState = {
		...state,
		junme: state.junme + 1,
		haiyama: state.haiyama.slice(1),
		sutehai: [...state.sutehai, tsumohai],
		tsumohai: state.haiyama[0],
	};
	await setGameState(client, userId, newGameState);
};

export const jikyoku = async (
	client: ReturnType<typeof createClient>,
	userId: string,
) => {
	const state = await getGameState(client, userId);
	if (!state) {
		throw new Error("game not found");
	}
	const newGameState: GameState = {
		...state,
		kyoku: state.kyoku + 1,
	};
	await setGameState(client, userId, newGameState);
};
