import { type Hai, haiToIndex } from "./utils";

function deleteSyuntsu(remainingTehai: TehaiIndex): number {
	let extractCount = 0;
	for (let kind = 0; kind < 3; kind++) {
		for (let i = 0; i <= 6; i++) {
			if (extractCount >= 4) {
				return extractCount;
			}
			const index = kind * 9 + i;
			while (
				remainingTehai[index] >= 1 &&
				remainingTehai[index + 1] >= 1 &&
				remainingTehai[index + 2] >= 1
			) {
				remainingTehai[index] -= 1;
				remainingTehai[index + 1] -= 1;
				remainingTehai[index + 2] -= 1;
				extractCount += 1;
			}
		}
	}
	return extractCount;
}

type TehaiIndex = number[];

export default function judgeAgari(tehai: Hai[]) {
	const tehaiIndex: TehaiIndex = Array(34).fill(0);
	for (const hai of tehai) {
		tehaiIndex[haiToIndex(hai) - 1] += 1;
	}

	// 雀頭を探す
	const jantoCandidates: number[] = [];
	for (let i = 0; i < tehaiIndex.length; i++) {
		if (tehaiIndex[i] >= 2) {
			jantoCandidates.push(i);
		}
	}

	for (const janto of jantoCandidates) {
		const tehaiCopy = tehaiIndex.concat();
		tehaiCopy[janto] -= 2;

		// 刻子を探す
		const koutsuCandidates: number[] = [];
		for (let i = 0; i < tehaiCopy.length; i++) {
			if (tehaiCopy[i] >= 3) {
				koutsuCandidates.push(i);
			}
		}

		// 刻子を選ぶ
		for (let bit = 0; bit < 1 << koutsuCandidates.length; bit++) {
			const tehaiWithoutJanto = tehaiCopy.concat();
			let extractCount = 0;
			for (let i = 0; i < koutsuCandidates.length; i++) {
				if (bit & (1 << i)) {
					tehaiWithoutJanto[koutsuCandidates[i]] -= 3;
					extractCount += 1;
				}
			}
			extractCount += deleteSyuntsu(tehaiWithoutJanto);
			if (extractCount === 4) {
				return true;
			}
		}
	}
	if (new Set(jantoCandidates).size === 7) {
		return true;
	}
	return false;
}
