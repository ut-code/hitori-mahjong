import { create } from "zustand";
import type { Hai } from "./hai";
import { sortTehai } from "./hai";

interface GameState {
	kyoku: number;
	junme: number;
	haiyama: Hai[];
	sutehai: Hai[];
	// Hai * 13
	tehai: Hai[];
	// null as an initial value
	tsumohai: Hai | null;
}

interface PlayerAction {
	// tsumo just after tedashi or tsumogiri
	tedashi: (index: number) => void;
	tsumogiri: () => void;
	jikyoku: () => void;
}

const useGameStore = create<GameState & PlayerAction>()((set, get) => ({
	kyoku: 1,
	junme: 1,
	haiyama: [],
	sutehai: [],
	tehai: [],
	tsumohai: null,

	tedashi: (index) => {
		const state = get();
		if (!state.tsumohai) {
			throw new Error("syohai");
		}
		const tsumohai = state.tsumohai;

		if (index < 0 || 12 < index) {
			throw new Error("index out of tehai length");
		}
		const deletedTehai = state.tehai.filter((_, i) => i !== index);
		const discardedHai = state.tehai[index];
		set(() => ({
			junme: state.junme + 1,
			haiyama: state.haiyama.slice(1),
			sutehai: [...state.sutehai, discardedHai],
			tehai: sortTehai([...deletedTehai, tsumohai]),
			tsumohai: state.haiyama[0],
		}));
	},
	tsumogiri: () => {
		const state = get();
		if (!state.tsumohai) {
			throw new Error("syohai");
		}
		const tsumohai = state.tsumohai;
		set(() => ({
			junme: state.junme + 1,
			haiyama: state.haiyama.slice(1),
			sutehai: [...state.sutehai, tsumohai],
			tsumohai: state.haiyama[0],
		}));
	},
	jikyoku: () => {
		const state = get();
		set(() => ({
			kyoku: state.kyoku + 1,
		}));
	},
}));
