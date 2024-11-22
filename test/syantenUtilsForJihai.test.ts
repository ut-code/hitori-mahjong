import { expect, test } from "bun:test";
import { constructHai, Hai } from "../src/utils/hai";
import {
  extractTehaiValueByKind,
  countHaiIndexForJihai,
  calculateCountInfoForJihai,
} from "../src/utils/calculateSyantenMentsu";

const tenpai: Hai[] = [
  constructHai("manzu", 1),
  constructHai("manzu", 2),
  constructHai("manzu", 3),
  constructHai("manzu", 3),
  constructHai("manzu", 4),
  constructHai("manzu", 5),
  constructHai("jihai", "pei"),
  constructHai("jihai", "pei"),
  constructHai("jihai", "pei"),
  constructHai("jihai", "haku"),
  constructHai("jihai", "haku"),
  constructHai("jihai", "haku"),
  constructHai("jihai", "tyun"),
];

test("check: extractTehaiValueByKind in manzu", () => {
  expect(extractTehaiValueByKind(tenpai, "manzu").toString()).toBe(
    [1, 2, 3, 3, 4, 5].toString(),
  );
});

test("check: extractTehaiValueByKind in manzu", () => {
  expect(extractTehaiValueByKind(tenpai, "jihai").toString()).toBe(
    ["pei", "pei", "pei", "haku", "haku", "haku", "tyun"].toString(),
  );
});

test("check: countHaiIndexForJihai", () => {
  expect(
    countHaiIndexForJihai([
      "pei",
      "pei",
      "pei",
      "haku",
      "haku",
      "haku",
      "tyun",
    ]).toString(),
  ).toBe([3, 3, 1].toString());
});

test("check: calculateCountInfoForJihai", () => {
  expect(JSON.stringify(calculateCountInfoForJihai([3, 3, 1]))).toBe(
    JSON.stringify([{ mentsu: 2, candidate: 0, haveToitsu: false }]),
  );
});
