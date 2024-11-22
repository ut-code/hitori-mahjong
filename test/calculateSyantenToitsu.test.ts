import { expect, test } from "bun:test";
import { constructHai, Hai } from "../src/utils/hai";
import calculateSyantenToitsu from "../src/utils/calculateSyantenToitsu";

const tehai1: Hai[] = [
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

test("judgeAgari chinitsu1", () => {
  expect(calculateSyantenToitsu(tehai1)).toBe(0);
});
