import type { Hai } from "./hai/utils";

export interface GameState {
	kyoku: number;
	junme: number;
	haiyama: Hai[];
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai | null;
}
