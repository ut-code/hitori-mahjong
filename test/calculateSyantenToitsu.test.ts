import { expect, test } from "bun:test";
import { constructHai, Hai } from "../src/utils/hai";
import calculateSyantenToitsu from "../src/utils/calculateSyantenToitsu";

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

test("calculateSyanten tenpaiToitsu", () => {
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

test("calculateSyanten iisyantenToitsu", () => {
  expect(calculateSyantenToitsu(iisyanten)).toBe(1);
});
