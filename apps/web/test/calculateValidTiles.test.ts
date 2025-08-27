import { expect, test } from "bun:test";
import { type Hai, constructHai } from "shared/hai";
import calculateValidTiles from "../src/utils/calculateValidTiles";

const tehaiQ148: Hai[] = [
	constructHai("manzu", 1),
	constructHai("manzu", 2),
	constructHai("manzu", 2),
	constructHai("manzu", 6),
	constructHai("manzu", 7),
	constructHai("manzu", 8),
	constructHai("manzu", 8),
	constructHai("manzu", 9),
	constructHai("pinzu", 4),
	constructHai("pinzu", 5),
	constructHai("souzu", 3),
	constructHai("souzu", 5),
	constructHai("souzu", 5),
];

const tsumoQ148: Hai = constructHai("souzu", 5);

test("Uzaku Q148", () => {
	expect(calculateValidTiles(tehaiQ148, tsumoQ148).get(1)).toEqual([
		constructHai("manzu", 1),
		constructHai("souzu", 3),
	]);
});

const tehaiQ149: Hai[] = [
	constructHai("manzu", 3),
	constructHai("manzu", 3),
	constructHai("manzu", 4),
	constructHai("pinzu", 1),
	constructHai("pinzu", 3),
	constructHai("pinzu", 5),
	constructHai("pinzu", 6),
	constructHai("pinzu", 6),
	constructHai("souzu", 6),
	constructHai("souzu", 7),
	constructHai("souzu", 8),
	constructHai("souzu", 8),
	constructHai("souzu", 9),
];

const tsumoQ149: Hai = constructHai("pinzu", 2);

test("Uzaku Q149", () => {
	expect(calculateValidTiles(tehaiQ149, tsumoQ149).get(1)).toEqual([
		constructHai("manzu", 3),
		constructHai("manzu", 4),
		constructHai("pinzu", 5),
		constructHai("pinzu", 6),
	]);
});

const tehaiQ150: Hai[] = [
	constructHai("manzu", 3),
	constructHai("manzu", 4),
	constructHai("pinzu", 1),
	constructHai("pinzu", 3),
	constructHai("pinzu", 6),
	constructHai("pinzu", 6),
	constructHai("pinzu", 6),
	constructHai("pinzu", 7),
	constructHai("souzu", 6),
	constructHai("souzu", 7),
	constructHai("souzu", 8),
	constructHai("souzu", 8),
	constructHai("souzu", 9),
];

const tsumoQ150: Hai = constructHai("pinzu", 2);

test("Uzaku Q150", () => {
	expect(calculateValidTiles(tehaiQ150, tsumoQ150).get(1)).toEqual([
		constructHai("manzu", 3),
		constructHai("manzu", 4),
		constructHai("pinzu", 6),
		constructHai("pinzu", 7),
		constructHai("souzu", 6),
		constructHai("souzu", 8),
		constructHai("souzu", 9),
	]);
});
