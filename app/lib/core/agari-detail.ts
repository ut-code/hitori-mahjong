import { haiToIndex, indexToHai } from "./hai";
import type { Hai } from "./types/hai";

export type AgariDetail =
	| { type: "standard"; mentsu: Hai[][]; janto: Hai[] }
	| { type: "chiitoitsu"; pairs: Hai[][] };

export function getAgariDetail(tehai: Hai[]): AgariDetail | null {
	const tehaiIndex = Array<number>(34).fill(0);
	for (const hai of tehai) {
		tehaiIndex[haiToIndex(hai) - 1] += 1;
	}

	const pairIndexes: number[] = [];
	for (let i = 0; i < tehaiIndex.length; i++) {
		if (tehaiIndex[i] >= 2) pairIndexes.push(i);
	}

	for (const jantoIndex of pairIndexes) {
		const withoutJanto = tehaiIndex.concat();
		withoutJanto[jantoIndex] -= 2;

		const koutsuCandidates: number[] = [];
		for (let i = 0; i < withoutJanto.length; i++) {
			if (withoutJanto[i] >= 3) koutsuCandidates.push(i);
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
				return { type: "standard", mentsu, janto: [jantoTile, jantoTile] };
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
