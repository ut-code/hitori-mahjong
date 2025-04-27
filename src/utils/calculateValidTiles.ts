import { Hai, sortTehai } from "./hai";
import calculateSyantenMentsu from "./calculateSyantenMentsu";

type ValidTileInfo = Map<number, Hai[]>;

export default function calculateValidTiles(
	tehai: Hai[],
	tsumo: Hai,
): ValidTileInfo {
	const tehai14 = sortTehai([...tehai, tsumo]);
	const validTileInfo = new Map<number, Hai[]>();
	for (let i = 0; i < tehai14.length; i++) {
		const tehai13 = tehai14.filter((_, index) => index !== i);
		const syanten = calculateSyantenMentsu(tehai13);
		const currentTiles = validTileInfo.get(syanten) ?? [];
		if (
			currentTiles.some(
				(tile) =>
					tile.kind === tehai14[i].kind && tile.value === tehai14[i].value,
			)
		) {
			continue;
		}
		validTileInfo.set(syanten, [...currentTiles, tehai14[i]]);
	}
	return validTileInfo;
}
