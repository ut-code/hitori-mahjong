import { expect, test } from "bun:test";
import { constructHai, Hai } from "../src/utils/hai";
import judgeAgari from "../src/utils/judgeAgari";

const chinitsu1: Hai[] = [
  constructHai("pinzu", 2),
  constructHai("pinzu", 3),
  constructHai("pinzu", 3),
  constructHai("pinzu", 3),
  constructHai("pinzu", 3),
  constructHai("pinzu", 4),
  constructHai("pinzu", 4),
  constructHai("pinzu", 5),
  constructHai("pinzu", 6),
  constructHai("pinzu", 6),
  constructHai("pinzu", 7),
  constructHai("pinzu", 7),
  constructHai("pinzu", 7),
  constructHai("pinzu", 8),
];

test("judgeAgari chinitsu1", () => {
  expect(judgeAgari(chinitsu1)).toBe(true);
});

const chinitsu2: Hai[] = [
  constructHai("pinzu", 3),
  constructHai("pinzu", 3),
  constructHai("pinzu", 3),
  constructHai("pinzu", 3),
  constructHai("pinzu", 4),
  constructHai("pinzu", 4),
  constructHai("pinzu", 4),
  constructHai("pinzu", 4),
  constructHai("pinzu", 5),
  constructHai("pinzu", 5),
  constructHai("pinzu", 5),
  constructHai("pinzu", 6),
  constructHai("pinzu", 6),
  constructHai("pinzu", 6),
];

test("judgeAgari chinitsu2", () => {
  expect(judgeAgari(chinitsu2)).toBe(true);
});

const daisyarin: Hai[] = [
  constructHai("pinzu", 2),
  constructHai("pinzu", 2),
  constructHai("pinzu", 3),
  constructHai("pinzu", 3),
  constructHai("pinzu", 4),
  constructHai("pinzu", 4),
  constructHai("pinzu", 5),
  constructHai("pinzu", 5),
  constructHai("pinzu", 6),
  constructHai("pinzu", 6),
  constructHai("pinzu", 7),
  constructHai("pinzu", 7),
  constructHai("pinzu", 8),
  constructHai("pinzu", 8),
];

test("judgeAgari daisyarin", () => {
  expect(judgeAgari(daisyarin)).toBe(true);
});

const chitoitsu: Hai[] = [
  constructHai("pinzu", 2),
  constructHai("pinzu", 2),
  constructHai("souzu", 3),
  constructHai("souzu", 3),
  constructHai("manzu", 4),
  constructHai("manzu", 4),
  constructHai("pinzu", 5),
  constructHai("pinzu", 5),
  constructHai("souzu", 6),
  constructHai("souzu", 6),
  constructHai("manzu", 7),
  constructHai("manzu", 7),
  constructHai("pinzu", 8),
  constructHai("pinzu", 8),
];

test("judgeAgari chitoitsu", () => {
  expect(judgeAgari(chitoitsu)).toBe(true);
});
