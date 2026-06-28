import type { Hai } from "./hai/types";

export type GameState = {
	kyoku: number;
	junme: number;
	remainTsumo: number;
	score: number;
	nextTsumohai: Hai | null;
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai | null;
};

export type GameStateRecord = {
	userId: string;
	kyoku: number;
	junme: number;
	remainTsumo: number;
	score: number;
	haiyama: Hai[];
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai[];
	haiyamaId: string | null;
};
