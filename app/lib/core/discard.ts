import { sortTehai } from "./hai";
import type { GameState } from "./types/game";

export type Discard =
	| { intent: "tedashi"; index: number }
	| { intent: "tsumogiri" };

// サーバーの応答を待たずに打牌を画面へ反映するため、クライアントでも同じ遷移を計算する。
// そうしないと打牌のたびに往復分の待ちが見え、操作が重く感じる
export function applyDiscard(state: GameState, discard: Discard): GameState {
	if (state.tsumohai === null) return state;
	const tehai = sortTehai(state.tehai);
	const base = {
		...state,
		tsumohai: state.nextTsumohai,
		nextTsumohai: null,
		junme: state.junme + 1,
		remainTsumo: Math.max(0, state.remainTsumo - 1),
	};
	if (discard.intent === "tsumogiri") {
		return { ...base, sutehai: [...state.sutehai, state.tsumohai] };
	}
	const discarded = tehai[discard.index];
	if (!discarded) return state;
	return {
		...base,
		sutehai: [...state.sutehai, discarded],
		tehai: sortTehai([
			...tehai.filter((_, i) => i !== discard.index),
			state.tsumohai,
		]),
	};
}
