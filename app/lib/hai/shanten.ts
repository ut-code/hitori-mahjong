import { type Hai, haiToIndex } from "./types";

type TehaiIndex = number[];

interface ShantenResult {
	shanten: number;
	isTenpai: boolean;
	isAgari: boolean;
}

/**
 * Calculate shanten number for a hand (13 or 14 tiles)
 * Returns the minimum shanten number considering:
 * - Standard form (4 mentsu + 1 janto)
 * - Seven pairs (chiitoitsu)
 */
export function calculateShanten(tehai: Hai[]): ShantenResult {
	if (tehai.length !== 13 && tehai.length !== 14) {
		return { shanten: 8, isTenpai: false, isAgari: false };
	}

	if (tehai.length === 14) {
		// Check if already winning
		const tehaiIndex: TehaiIndex = Array(34).fill(0);
		for (const hai of tehai) {
			tehaiIndex[haiToIndex(hai) - 1] += 1;
		}
		if (checkAgari(tehaiIndex)) {
			return { shanten: -1, isTenpai: false, isAgari: true };
		}

		let minShanten = 8;
		for (let i = 0; i < tehai.length; i++) {
			const tehai13 = tehai.concat();
			tehai13.splice(i, 1);
			const standardShanten = calcStandardShanten(tehai13);
			const chiitoiShanten = calcChiitoiShanten(tehai13);
			minShanten = Math.min(minShanten, standardShanten, chiitoiShanten);
		}

		return {
			shanten: minShanten,
			isTenpai: minShanten === 0,
			isAgari: false,
		};
	}

	const standardShanten = calcStandardShanten(tehai);
	const chiitoiShanten = calcChiitoiShanten(tehai);

	const minShanten = Math.min(standardShanten, chiitoiShanten);

	return {
		shanten: minShanten,
		isTenpai: minShanten === 0,
		isAgari: false,
	};
}

function checkAgari(tehaiIndex: TehaiIndex): boolean {
	if (checkStandardAgari(tehaiIndex)) {
		return true;
	}

	return checkChiitoiAgari(tehaiIndex);
}

function checkStandardAgari(tehaiIndex: TehaiIndex): boolean {
	// Check janto candidates
	const jantoCandidates: number[] = [];
	for (let i = 0; i < tehaiIndex.length; i++) {
		if (tehaiIndex[i] >= 2) {
			jantoCandidates.push(i);
		}
	}

	for (const janto of jantoCandidates) {
		const tehaiCopy = tehaiIndex.concat();
		tehaiCopy[janto] -= 2;

		const koutsuCandidates: number[] = [];
		for (let i = 0; i < tehaiCopy.length; i++) {
			if (tehaiCopy[i] >= 3) {
				koutsuCandidates.push(i);
			}
		}

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

	return false;
}

function checkChiitoiAgari(tehaiIndex: TehaiIndex): boolean {
	const pairKindCount = tehaiIndex.filter((count) => count >= 2).length;
	return pairKindCount === 7;
}

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

/**
 * Calculate shanten for standard form (4 mentsu + 1 janto)
 * Uses the general algorithm:
 * shanten = 8 - 2*mentsu - min(partialMentsu, 4-mentsu) - (jantoExists ? 1 : 0)
 */
export function calcStandardShanten(tehai: Hai[]): number {
	if (tehai.length !== 13) {
		return 8;
	}

	const tehaiIndex: TehaiIndex = Array(34).fill(0);
	for (const hai of tehai) {
		tehaiIndex[haiToIndex(hai) - 1] += 1;
	}

	return calcShantenForTehai(tehaiIndex);
}

// Simplified shanten calculation using recursive approach
function calcShantenForTehai(tehaiIndex: TehaiIndex): number {
	let minShanten = 8; // Maximum possible shanten

	// Try all possible mentsu extractions
	function backtrack(
		tehai: TehaiIndex,
		mentsu: number,
		partialMentsu: number,
		hasJanto: boolean,
	): void {
		const currentShanten =
			8 - 2 * mentsu - Math.min(partialMentsu, 4 - mentsu) - (hasJanto ? 1 : 0);
		if (currentShanten < minShanten) {
			minShanten = currentShanten;
		}

		if (mentsu >= 4) return;

		// Find next tile with count > 0
		let startIdx = -1;
		for (let i = 0; i < 34; i++) {
			if (tehai[i] > 0) {
				startIdx = i;
				break;
			}
		}
		if (startIdx === -1) return;

		// Try to form koutsu
		if (tehai[startIdx] >= 3) {
			const next = tehai.concat();
			next[startIdx] -= 3;
			backtrack(next, mentsu + 1, partialMentsu, hasJanto);
		}

		// Try to form partial koutsu
		if (tehai[startIdx] >= 2) {
			const next = tehai.concat();
			next[startIdx] -= 2;
			backtrack(next, mentsu, partialMentsu + 1, hasJanto);
		}

		// Try to form partial shuntsu (need tiles at i, i+1 or i, i+2 or i+1, i+2)
		const kind = Math.floor(startIdx / 9);
		const value = startIdx % 9;
		if (kind < 3) {
			// i, i+1
			if (value <= 7 && tehai[startIdx + 1] >= 1) {
				const next = tehai.concat();
				next[startIdx] -= 1;
				next[startIdx + 1] -= 1;
				backtrack(next, mentsu, partialMentsu + 1, hasJanto);
			}
			// i, i+2
			if (value <= 6 && tehai[startIdx + 2] >= 1) {
				const next = tehai.concat();
				next[startIdx] -= 1;
				next[startIdx + 2] -= 1;
				backtrack(next, mentsu, partialMentsu + 1, hasJanto);
			}
		}

		// Try to form shuntsu
		if (value <= 6) {
			const idx1 = kind * 9 + value;
			const idx2 = kind * 9 + value + 1;
			const idx3 = kind * 9 + value + 2;
			if (tehai[idx1] >= 1 && tehai[idx2] >= 1 && tehai[idx3] >= 1) {
				const next = tehai.concat();
				next[idx1] -= 1;
				next[idx2] -= 1;
				next[idx3] -= 1;
				backtrack(next, mentsu + 1, partialMentsu, hasJanto);
			}
		}

		// Try to form janto
		if (!hasJanto && tehai[startIdx] >= 2) {
			const next = tehai.concat();
			next[startIdx] -= 2;
			backtrack(next, mentsu, partialMentsu, true);
		}

		// Skip this tile
		const next = tehai.concat();
		next[startIdx] = 0;
		backtrack(next, mentsu, partialMentsu, hasJanto);
	}

	backtrack(tehaiIndex, 0, 0, false);
	return minShanten;
}

/**
 * Calculate shanten for seven pairs (chiitoitsu)
 * shanten = 6 - (number of pairs)
 * Special case: if 6 pairs + 1 tile, shanten = 0 (tenpai)
 */
export function calcChiitoiShanten(tehai: Hai[]): number {
	if (tehai.length !== 13) {
		return 8; // Invalid
	}

	const pairCount = countPairs(tehai);
	// Chiitoitsu needs 7 pairs, so shanten = 6 - pairs
	// With 7 pairs, shanten = -1 (complete)
	return 6 - pairCount;
}

function countPairs(tehai: Hai[]): number {
	const count: Record<string, number> = {};
	for (const hai of tehai) {
		const key = `${hai.kind}_${hai.value}`;
		count[key] = (count[key] || 0) + 1;
	}

	let pairs = 0;
	for (const c of Object.values(count)) {
		if (c >= 2) {
			pairs += 1;
		}
	}
	return pairs;
}
