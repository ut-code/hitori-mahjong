import type { Fetcher } from "react-router";
import { sortTehai } from "@/lib/hai/types";
import type { GameState } from "@/lib/types";
import { TOTAL_TSUMO_PER_KYOKU } from "./constants";

export function computeOptimisticGameState(
	loaderData: GameState,
	discardFetcher: Fetcher<GameState>,
) {
	const fetcherGameState =
		discardFetcher.data && "tehai" in discardFetcher.data
			? discardFetcher.data
			: null;

	const currentGameState =
		fetcherGameState?.kyoku === loaderData.kyoku
			? fetcherGameState
			: loaderData;

	const {
		sutehai,
		tsumohai,
		nextTsumohai,
		junme,
		kyoku,
		tehai,
		remainTsumo,
		score,
	} = currentGameState;

	const baseSortedTehai = sortTehai(tehai);

	let optimisticSutehai = sutehai;
	let optimisticTehai = baseSortedTehai;
	let optimisticTsumohai = tsumohai;
	let optimisticJunme = junme;
	let optimisticRemainTsumo = remainTsumo;

	if (
		discardFetcher.state !== "idle" &&
		discardFetcher.formData &&
		tsumohai !== null
	) {
		const nextRemainTsumo = Math.max(0, remainTsumo - 1);

		if (discardFetcher.formAction?.endsWith("/api/tedashi")) {
			const index = Number(discardFetcher.formData.get("index"));
			if (
				Number.isInteger(index) &&
				index >= 0 &&
				index < baseSortedTehai.length
			) {
				const discardHai = baseSortedTehai[index];
				const remainingTehai = baseSortedTehai.filter((_, i) => i !== index);
				optimisticSutehai = [...sutehai, discardHai];
				optimisticTehai = sortTehai([...remainingTehai, tsumohai]);
				optimisticTsumohai = nextTsumohai;
				optimisticJunme = junme + 1;
				optimisticRemainTsumo = nextRemainTsumo;
			}
		} else if (discardFetcher.formAction?.endsWith("/api/tsumogii")) {
			optimisticSutehai = [...sutehai, tsumohai];
			optimisticTsumohai = nextTsumohai;
			optimisticJunme = junme + 1;
			optimisticRemainTsumo = nextRemainTsumo;
		}
	}
	const tsumoProgressValue = Math.max(
		0,
		TOTAL_TSUMO_PER_KYOKU - optimisticRemainTsumo,
	);
	return {
		currentGameState,
		kyoku,
		score,
		optimisticTehai,
		optimisticTsumohai,
		optimisticSutehai,
		optimisticJunme,
		optimisticRemainTsumo,
		tsumoProgressValue,
	};
}
