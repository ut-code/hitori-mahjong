import { expect, test } from "bun:test";
import { type Hai, constructHai } from "shared/hai";
import calculateSyantenMentsu from "../src/utils/calculateSyantenMentsu";

const tenpai: Hai[] = [
	constructHai("manzu", 1),
	constructHai("manzu", 1),
	constructHai("manzu", 1),
	constructHai("manzu", 3),
	constructHai("manzu", 3),
	constructHai("manzu", 3),
	constructHai("jihai", "pei"),
	constructHai("jihai", "pei"),
	constructHai("jihai", "pei"),
	constructHai("jihai", "haku"),
	constructHai("jihai", "haku"),
	constructHai("jihai", "haku"),
	constructHai("jihai", "tyun"),
];

test("judgeAgari tenapaiMentsu", () => {
	expect(calculateSyantenMentsu(tenpai)).toBe(0);
});

const isyanten: Hai[] = [
	constructHai("manzu", 1),
	constructHai("manzu", 2),
	constructHai("manzu", 3),
	constructHai("manzu", 4),
	constructHai("manzu", 5),
	constructHai("manzu", 6),
	constructHai("manzu", 7),
	constructHai("manzu", 8),
	constructHai("manzu", 9),
	constructHai("jihai", "haku"),
	constructHai("jihai", "haku"),
	constructHai("souzu", 7),
	constructHai("pinzu", 4),
];

test("judgeAgari iisyantenMentsu", () => {
	expect(calculateSyantenMentsu(isyanten)).toBe(1);
});
