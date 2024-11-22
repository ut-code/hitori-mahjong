import { expect, test } from "bun:test";
import { constructHai, Hai } from "../src/utils/hai";
import judgeIisyanten from "../src/utils/judgeIisyanten";

const Iisyanten: Hai[] = [
  constructHai("manzu", 1),
  constructHai("manzu", 1),
  constructHai("manzu", 1),
  constructHai("manzu", 3),
  constructHai("manzu", 3),
  constructHai("manzu", 3),
  constructHai("souzu", 1),
  constructHai("souzu", 2),
  constructHai("souzu", 3),
  constructHai("jihai", "haku"),
  constructHai("jihai", "haku"),
  constructHai("manzu", 5),
  constructHai("pinzu", 5),
];

test("judge Iisyanten", () => {
  expect(judgeIisyanten(Iisyanten)).toBe(true);
});
