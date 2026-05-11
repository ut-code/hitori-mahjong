import { useEffect, useState } from "react";
import { calculateShanten } from "~/lib/hai/shanten";
import type { Hai } from "~/lib/hai/types";
import { sortTehai } from "~/lib/hai/types";
import { getHaiKey } from "./utils";

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

function buildHintDiscards(
	optimisticTehai: Hai[],
	optimisticTsumohai: Hai,
	currentShanten: number,
): {
	discards: ShantenAdvanceDiscard[];
	isAdvanceHint: boolean;
} {
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

export function useHints(
	optimisticTehai: Hai[],
	optimisticTsumohai: Hai | null,
	shantenResult: { shanten: number },
	optimisticJunme: number,
	isHintCalculating: boolean,
) {
	const [showHints, setShowHints] = useState(false);
	const [hintDiscards, setHintDiscards] = useState<ShantenAdvanceDiscard[]>([]);
	const [isAdvanceHint, setIsAdvanceHint] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset hints on each junme change
	useEffect(() => {
		setShowHints(false);
		setHintDiscards([]);
		setIsAdvanceHint(true);
	}, [optimisticJunme]);

	const handleHintToggle = () => {
		if (showHints) {
			setShowHints(false);
			return;
		}
		if (!optimisticTsumohai || isHintCalculating) return;

		const result = buildHintDiscards(
			optimisticTehai,
			optimisticTsumohai,
			shantenResult.shanten,
		);
		setHintDiscards(result.discards);
		setIsAdvanceHint(result.isAdvanceHint);
		setShowHints(true);
	};

	return {
		showHints,
		hintDiscards,
		isAdvanceHint,
		hasAnyHints: hintDiscards.length > 0,
		handleHintToggle,
	};
}
