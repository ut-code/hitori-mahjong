import {
	type Hai,
	type HaiKind,
	type JihaiValue,
	constructHai,
} from "shared/hai";
import judgeAgari from "./judgeAgari";

export default function calculateMachihai(tehai: Hai[]): Hai[] {
	const machihai: Hai[] = [];
	const haiKinds: HaiKind[] = ["manzu", "pinzu", "souzu", "jihai"];
	const jihaiValues: JihaiValue[] = [
		"ton",
		"nan",
		"sya",
		"pei",
		"haku",
		"hatsu",
		"tyun",
	];
	for (const kind of haiKinds) {
		if (kind === "jihai") {
			for (const value of jihaiValues) {
				const newHai: Hai = constructHai(kind, value);
				const newTehai: Hai[] = [...tehai, newHai];
				if (judgeAgari(newTehai)) {
					machihai.push(newHai);
				}
			}
		} else {
			for (let value = 1; value < 10; value++) {
				const newHai: Hai = constructHai(kind, value);
				const newTehai: Hai[] = [...tehai, newHai];
				if (judgeAgari(newTehai)) {
					machihai.push(newHai);
				}
			}
		}
	}
	return machihai;
}
