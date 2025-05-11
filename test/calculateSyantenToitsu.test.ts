import { expect, test } from "bun:test";
import calculateSyantenToitsu from "../src/utils/calculateSyantenToitsu";
import { type Hai, constructHai } from "../src/utils/hai";

const tenpai: Hai[] = [
	constructHai("jihai", "ton"),
	constructHai("jihai", "ton"),
	constructHai("jihai", "nan"),
	constructHai("jihai", "nan"),
	constructHai("jihai", "sya"),
	constructHai("jihai", "sya"),
	constructHai("jihai", "pei"),
	constructHai("jihai", "pei"),
	constructHai("jihai", "haku"),
	constructHai("jihai", "haku"),
	constructHai("jihai", "hatsu"),
	constructHai("jihai", "hatsu"),
	constructHai("jihai", "tyun"),
];

test("judgeAgari tenpaiToitsu", () => {
	expect(calculateSyantenToitsu(tenpai)).toBe(0);
});

const iisyanten: Hai[] = [
	constructHai("jihai", "ton"),
	constructHai("jihai", "ton"),
	constructHai("jihai", "nan"),
	constructHai("jihai", "nan"),
	constructHai("jihai", "sya"),
	constructHai("jihai", "sya"),
	constructHai("jihai", "pei"),
	constructHai("jihai", "pei"),
	constructHai("jihai", "haku"),
	constructHai("jihai", "haku"),
	constructHai("souzu", 1),
	constructHai("souzu", 2),
	constructHai("souzu", 3),
];

test("judgeAgari iisyantenToitsu", () => {
	expect(calculateSyantenToitsu(iisyanten)).toBe(1);
});
