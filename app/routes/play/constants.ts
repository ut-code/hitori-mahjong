export const TOTAL_TSUMO_PER_KYOKU = 18;

const SUHAI_KINDS = ["manzu", "pinzu", "souzu"] as const;

const JIHAI_VALUES = [
	"ton",
	"nan",
	"sya",
	"pei",
	"haku",
	"hatsu",
	"tyun",
] as const;

export const TILE_IMAGE_PATHS = [
	...SUHAI_KINDS.flatMap((kind) =>
		Array.from({ length: 9 }, (_, index) => `/hai/${kind}_${index + 1}.png`),
	),
	...JIHAI_VALUES.map((value) => `/hai/jihai_${value}.png`),
];
