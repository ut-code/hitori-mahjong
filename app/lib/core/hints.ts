import { getHaiKey, sortTehai } from "@/lib/core/hai";
import { calculateShanten } from "@/lib/core/shanten";
import type { Hai } from "@/lib/core/types/hai";

export type ShantenAdvanceDiscard = {
	hai: Hai;
	resultingShanten: number;
};

function dedupe(discards: ShantenAdvanceDiscard[]): ShantenAdvanceDiscard[] {
	const seen = new Map<string, ShantenAdvanceDiscard>();
	for (const discard of discards) {
		const key = `${getHaiKey(discard.hai)}-${discard.resultingShanten}`;
		if (!seen.has(key)) seen.set(key, discard);
	}
	return [...seen.values()];
}

export function buildHintDiscards(
	optimisticTehai: Hai[],
	optimisticTsumohai: Hai,
	currentShanten: number,
): { discards: ShantenAdvanceDiscard[]; isAdvanceHint: boolean } {
	const allDiscards = optimisticTehai.map((hai, index) => {
		const remainingTehai = optimisticTehai.filter((_, i) => i !== index);
		const nextTehai = sortTehai([...remainingTehai, optimisticTsumohai]);
		return { hai, resultingShanten: calculateShanten(nextTehai).shanten };
	});

	const minShanten = Math.min(...allDiscards.map((d) => d.resultingShanten));

	if (minShanten < currentShanten) {
		return {
			discards: dedupe(
				allDiscards.filter((d) => d.resultingShanten === minShanten),
			),
			isAdvanceHint: true,
		};
	}

	return {
		discards: dedupe([
			...allDiscards.filter((d) => d.resultingShanten === currentShanten),
			{ hai: optimisticTsumohai, resultingShanten: currentShanten },
		]),
		isAdvanceHint: false,
	};
}
