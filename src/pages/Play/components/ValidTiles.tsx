import calculateValidTiles from "../../../utils/calculateValidTiles";
import type { Hai } from "../../../utils/hai";

type ValidTilesProps = {
	tehai: Hai[];
	tsumo: Hai;
};

export default function ValidTiles(props: ValidTilesProps) {
	const validTileInfo = calculateValidTiles(props.tehai, props.tsumo);
	const shortenedInfo = extractValidTile(validTileInfo);
	const keys = [...shortenedInfo.keys()];
	return (
		<div className="rounded-[1rem] shadow-md h-[90%]">
			{keys.map((key) => (
				<div key={key}>
					<p className="text-xl font-medium pt-4">{key} </p>
					<ul className="flex justify-center list-none">
						{shortenedInfo.get(key)?.map((hai) => (
							<li key={`${hai.kind} - ${hai.value}`}>
								<img
									src={`/hai/${hai.kind}_${hai.value}.png`}
									alt={`${hai.kind} ${hai.value}`}
									width="50"
									height="70"
								/>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}

// シャンテン数が最も小さくする打牌10種とその次に小さくする打破10種を取り出す
function extractValidTile(
	validTileInfo: Map<number, Hai[]>,
): Map<string, Hai[]> {
	const shortenedInfo = new Map<string, Hai[]>();
	const minStn =
		((validTileInfo: Map<number, Hai[]>) => {
			for (let i = 0; i < 13; i++) {
				if (validTileInfo.get(i) !== undefined) {
					return i;
				}
			}
		})(validTileInfo) ?? 13;

	const bestTiles = validTileInfo.get(minStn) ?? [];
	const secBestTiles = validTileInfo.get(minStn + 1) ?? [];

	if (bestTiles.length > 10) {
		shortenedInfo.set(
			minStn === 0 ? "テンパイ" : `${minStn}シャンテン`,
			bestTiles.slice(0, 10) ?? [],
		);
	} else {
		shortenedInfo.set(
			minStn === 0 ? "テンパイ" : `${minStn}シャンテン`,
			bestTiles ?? [],
		);
	}

	if (secBestTiles.length > 10) {
		shortenedInfo.set(
			`${minStn + 1}シャンテン`,
			secBestTiles.slice(0, 10) ?? [],
		);
	} else {
		shortenedInfo.set(`${minStn + 1}シャンテン`, secBestTiles ?? []);
	}

	return shortenedInfo;
}
