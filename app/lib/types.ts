import type { Hai } from "./hai/types";

export interface GameState {
	kyoku: number;
	junme: number;
	remainTsumo: number;
	score: number;
	nextTsumohai: Hai | null;
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai | null;
}
