import type { FetcherWithComponents } from "react-router";
import type { Hai } from "@/lib/hai/types";
import { haiToIndex, indexToHai } from "@/lib/hai/types";
import { getHaiKey } from "./utils";

type AgariDetail =
	| {
			type: "standard";
			mentsu: Hai[][];
			janto: Hai[];
	  }
	| {
			type: "chiitoitsu";
			pairs: Hai[][];
	  };

function getAgariDetail(tehai: Hai[]): AgariDetail | null {
	const tehaiIndex = Array<number>(34).fill(0);
	for (const hai of tehai) {
		tehaiIndex[haiToIndex(hai) - 1] += 1;
	}

	const pairIndexes: number[] = [];
	for (let i = 0; i < tehaiIndex.length; i++) {
		if (tehaiIndex[i] >= 2) {
			pairIndexes.push(i);
		}
	}

	for (const jantoIndex of pairIndexes) {
		const withoutJanto = tehaiIndex.concat();
		withoutJanto[jantoIndex] -= 2;

		const koutsuCandidates: number[] = [];
		for (let i = 0; i < withoutJanto.length; i++) {
			if (withoutJanto[i] >= 3) {
				koutsuCandidates.push(i);
			}
		}

		for (let bit = 0; bit < 1 << koutsuCandidates.length; bit++) {
			const remaining = withoutJanto.concat();
			const mentsu: Hai[][] = [];
			let isValid = true;

			for (let i = 0; i < koutsuCandidates.length; i++) {
				if (bit & (1 << i)) {
					const idx = koutsuCandidates[i];
					remaining[idx] -= 3;
					if (remaining[idx] < 0) {
						isValid = false;
						break;
					}
					const tile = indexToHai(idx + 1);
					mentsu.push([tile, tile, tile]);
				}
			}
			if (!isValid) continue;

			for (let kind = 0; kind < 3; kind++) {
				for (let i = 0; i <= 6; i++) {
					const idx = kind * 9 + i;
					while (
						remaining[idx] >= 1 &&
						remaining[idx + 1] >= 1 &&
						remaining[idx + 2] >= 1
					) {
						remaining[idx] -= 1;
						remaining[idx + 1] -= 1;
						remaining[idx + 2] -= 1;
						mentsu.push([
							indexToHai(idx + 1),
							indexToHai(idx + 2),
							indexToHai(idx + 3),
						]);
					}
				}
			}

			if (mentsu.length === 4 && remaining.every((count) => count === 0)) {
				const jantoTile = indexToHai(jantoIndex + 1);
				return {
					type: "standard",
					mentsu,
					janto: [jantoTile, jantoTile],
				};
			}
		}
	}

	if (
		pairIndexes.length === 7 &&
		tehaiIndex.every((count) => count === 0 || count === 2)
	) {
		return {
			type: "chiitoitsu",
			pairs: pairIndexes.map((idx) => {
				const tile = indexToHai(idx + 1);
				return [tile, tile];
			}),
		};
	}

	return null;
}

type AgariModalProps = {
	optimisticTehai: Hai[];
	optimisticTsumohai: Hai;
	agariScoreDelta: number;
	optimisticJunme: number;
	actionFetcher: FetcherWithComponents<unknown>;
};

export function AgariModal({
	optimisticTehai,
	optimisticTsumohai,
	agariScoreDelta,
	optimisticJunme,
	actionFetcher,
}: AgariModalProps) {
	const agariDetail = getAgariDetail([...optimisticTehai, optimisticTsumohai]);

	return (
		<dialog id="agari_modal" className="modal" open>
			<div className="modal-box bg-[#0F2918] border border-yellow-700 text-white">
				<h3 className="font-bold text-2xl text-yellow-400">和了</h3>
				<p className="mt-2">獲得スコア: +{agariScoreDelta}</p>
				<div className="mt-2">
					<p className="text-sm mb-1">ツモ牌</p>
					<img
						src={`/hai/${optimisticTsumohai.kind}_${optimisticTsumohai.value}.png`}
						alt={`${optimisticTsumohai.kind} ${optimisticTsumohai.value}`}
						className="w-8 h-11 md:w-10 md:h-14"
					/>
				</div>
				{agariDetail?.type === "standard" && (
					<div className="mt-2">
						<p className="text-sm mb-1">雀頭</p>
						<div className="flex gap-0 mb-2">
							{(() => {
								const seen = new Map<string, number>();
								return agariDetail.janto.map((hai) => {
									const baseKey = getHaiKey(hai);
									const count = (seen.get(baseKey) ?? 0) + 1;
									seen.set(baseKey, count);
									return (
										<img
											key={`janto-${baseKey}-${count}`}
											src={`/hai/${hai.kind}_${hai.value}.png`}
											alt={`${hai.kind} ${hai.value}`}
											className="w-8 h-11 md:w-10 md:h-14"
										/>
									);
								});
							})()}
						</div>
						<p className="text-sm mb-1">面子</p>
						<div className="grid grid-cols-1 md:grid-cols-[max-content_max-content] md:justify-start gap-y-1 md:gap-x-10">
							{(() => {
								const seenMentsu = new Map<string, number>();
								return agariDetail.mentsu.map((mentsu) => {
									const mentsuKeyBase = mentsu.map(getHaiKey).join("_");
									const mentsuCount = (seenMentsu.get(mentsuKeyBase) ?? 0) + 1;
									seenMentsu.set(mentsuKeyBase, mentsuCount);
									const seenHai = new Map<string, number>();
									return (
										<div
											key={`mentsu-${mentsuKeyBase}-${mentsuCount}`}
											className="flex gap-0"
										>
											{mentsu.map((hai) => {
												const baseKey = getHaiKey(hai);
												const count = (seenHai.get(baseKey) ?? 0) + 1;
												seenHai.set(baseKey, count);
												return (
													<img
														key={`mentsu-hai-${baseKey}-${count}`}
														src={`/hai/${hai.kind}_${hai.value}.png`}
														alt={`${hai.kind} ${hai.value}`}
														className="w-8 h-11 md:w-10 md:h-14"
													/>
												);
											})}
										</div>
									);
								});
							})()}
						</div>
					</div>
				)}
				{agariDetail?.type === "chiitoitsu" && (
					<div className="mt-2">
						<p className="text-sm mb-1">七対子</p>
						<div className="grid grid-cols-4 gap-1">
							{(() => {
								const seenPairs = new Map<string, number>();
								return agariDetail.pairs.map((pair) => {
									const pairKeyBase = pair.map(getHaiKey).join("_");
									const pairCount = (seenPairs.get(pairKeyBase) ?? 0) + 1;
									seenPairs.set(pairKeyBase, pairCount);
									const seenHai = new Map<string, number>();
									return (
										<div
											key={`pair-${pairKeyBase}-${pairCount}`}
											className="flex gap-0"
										>
											{pair.map((hai) => {
												const baseKey = getHaiKey(hai);
												const count = (seenHai.get(baseKey) ?? 0) + 1;
												seenHai.set(baseKey, count);
												return (
													<img
														key={`pair-hai-${baseKey}-${count}`}
														src={`/hai/${hai.kind}_${hai.value}.png`}
														alt={`${hai.kind} ${hai.value}`}
														className="w-8 h-11 md:w-10 md:h-14"
													/>
												);
											})}
										</div>
									);
								});
							})()}
						</div>
					</div>
				)}
				<div className="modal-action">
					<actionFetcher.Form method="post" action="/api/agari">
						<input type="hidden" value={optimisticJunme} name="junme" />
						<button
							className="btn bg-yellow-600 text-white border-none"
							type="submit"
							disabled={actionFetcher.state !== "idle"}
						>
							確認
						</button>
					</actionFetcher.Form>
				</div>
			</div>
		</dialog>
	);
}
