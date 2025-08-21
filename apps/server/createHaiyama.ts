import { type Hai, constructHai } from "../src/utils/hai.js";

function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export default function createHaiyama(): Hai[] {
	const kinds = ["manzu", "pinzu", "souzu", "jihai"];
	let sortedHaiyama: Hai[] = [];

	for (const kind of kinds) {
		// 数牌のみ牌山に含む
		if (kind === "manzu" || kind === "pinzu" || kind === "souzu") {
			for (let value = 1; value < 10; value++) {
				sortedHaiyama = sortedHaiyama.concat(
					new Array<Hai>(4).fill(constructHai(kind, value)),
				);
			}
		}
	}
	return shuffleArray(sortedHaiyama);
}
