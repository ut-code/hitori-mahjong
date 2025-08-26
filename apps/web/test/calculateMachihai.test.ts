import { expect, test } from "bun:test";
import calculateMachihai from "../src/utils/calculateMachihai";
import { type Hai, constructHai } from "../src/utils/hai";

const ryanmen: Hai[] = [
	constructHai("jihai", "pei"),
	constructHai("jihai", "pei"),
	constructHai("pinzu", 1),
	constructHai("pinzu", 2),
	constructHai("pinzu", 3),
	constructHai("pinzu", 4),
	constructHai("pinzu", 5),
	constructHai("pinzu", 6),
	constructHai("pinzu", 7),
	constructHai("pinzu", 8),
	constructHai("pinzu", 9),
	constructHai("souzu", 7),
	constructHai("souzu", 8),
];

test("calculateMachihai ryanmen", () => {
	expect(calculateMachihai(ryanmen)).toEqual([
		constructHai("souzu", 6),
		constructHai("souzu", 9),
	]);
});

const sanmentyan: Hai[] = [
	constructHai("jihai", "pei"),
	constructHai("jihai", "pei"),
	constructHai("pinzu", 1),
	constructHai("pinzu", 2),
	constructHai("pinzu", 3),
	constructHai("pinzu", 4),
	constructHai("pinzu", 5),
	constructHai("pinzu", 6),
	constructHai("souzu", 4),
	constructHai("souzu", 5),
	constructHai("souzu", 6),
	constructHai("souzu", 7),
	constructHai("souzu", 8),
];

test("calculateMachihai ryanmen", () => {
	expect(calculateMachihai(sanmentyan)).toEqual([
		constructHai("souzu", 3),
		constructHai("souzu", 6),
		constructHai("souzu", 9),
	]);
});

const syanpon: Hai[] = [
	constructHai("jihai", "pei"),
	constructHai("jihai", "pei"),
	constructHai("pinzu", 1),
	constructHai("pinzu", 2),
	constructHai("pinzu", 3),
	constructHai("pinzu", 4),
	constructHai("pinzu", 5),
	constructHai("pinzu", 6),
	constructHai("souzu", 4),
	constructHai("souzu", 5),
	constructHai("souzu", 6),
	constructHai("souzu", 7),
	constructHai("souzu", 7),
];

test("calculateMachihai syanpon", () => {
	expect(calculateMachihai(syanpon)).toEqual([
		constructHai("souzu", 7),
		constructHai("jihai", "pei"),
	]);
});

const ryanpeiko: Hai[] = [
	constructHai("jihai", "pei"),
	constructHai("jihai", "pei"),
	constructHai("pinzu", 1),
	constructHai("pinzu", 1),
	constructHai("pinzu", 2),
	constructHai("pinzu", 2),
	constructHai("pinzu", 3),
	constructHai("pinzu", 3),
	constructHai("pinzu", 7),
	constructHai("pinzu", 7),
	constructHai("pinzu", 8),
	constructHai("pinzu", 8),
	constructHai("pinzu", 9),
];

test("calculateMachihai ryanpeiko", () => {
	expect(calculateMachihai(ryanpeiko)).toEqual([
		constructHai("pinzu", 6),
		constructHai("pinzu", 9),
	]);
});
