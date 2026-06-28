export type Hai =
	| {
			kind: SuhaiKind;
			value: number;
	  }
	| {
			kind: "jihai";
			value: JihaiValue;
	  };

export type SuhaiKind = "manzu" | "pinzu" | "souzu";
export type HaiKind = SuhaiKind | "jihai";

export type HaiWithID = {
	kind: HaiKind;
	value: JihaiValue | number;
	id: number;
};

const kindOrder: HaiKind[] = ["manzu", "pinzu", "souzu", "jihai"];

const jihaiOrder: JihaiValue[] = [
	"ton",
	"nan",
	"sya",
	"pei",
	"haku",
	"hatsu",
	"tyun",
];

export function haiToIndex(hai: Hai): number {
	if (hai.kind === "jihai") {
		return 27 + 1 + jihaiOrder.indexOf(hai.value);
	}
	return 9 * kindOrder.indexOf(hai.kind) + hai.value;
}

export function indexToHai(index: number): Hai {
	if (index <= 0 || index > 34) {
		throw new Error("invalid index");
	}
	const zeroBasedIndex = index - 1;
	const kindIndex = Math.floor(zeroBasedIndex / 9);
	const kind = kindOrder[kindIndex];
	if (kind === "jihai") {
		return constructHai(kind, jihaiOrder[zeroBasedIndex - 27]);
	}
	return constructHai(kind, (zeroBasedIndex % 9) + 1);
}

export type JihaiValue =
	| "ton"
	| "nan"
	| "sya"
	| "pei"
	| "haku"
	| "hatsu"
	| "tyun";

export function constructHai(kind: HaiKind, value: number | JihaiValue): Hai {
	if (kind === "manzu" || kind === "pinzu" || kind === "souzu") {
		if (typeof value === "number") {
			return {
				kind,
				value,
			};
		}
		throw new Error("suhai requires number");
	}
	if (typeof value === "string") {
		return {
			kind,
			value,
		};
	}
	throw new Error("jihai requires JihaiValue");
}

export function sortTehai(haiArray: Hai[]): Hai[] {
	return haiArray.sort((a, b) => haiToIndex(a) - haiToIndex(b));
}
