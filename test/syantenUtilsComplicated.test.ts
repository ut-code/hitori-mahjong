import { expect, test } from "bun:test";
import { calculateCountInfo, calculateInfo, iterProduct } from "../src/utils/calculateSyantenMentsu";

const info1: MentsuCountInfo = {
  mentsu: 2,
  candidate: 1,
  haveToitsu: false,
};
const info2: MentsuCountInfo = {
  mentsu: 0,
  candidate: 5,
  haveToitsu: true,
};
const info3: MentsuCountInfo = {
  mentsu: 1,
  candidate: 3,
  haveToitsu: false,
};
const info4: MentsuCountInfo = {
  mentsu: 1,
  candidate: 4,
  haveToitsu: true,
};
const info5: MentsuCountInfo = {
  mentsu: 0,
  candidate: 1,
  haveToitsu: true,
};

// test("check: screenMentsuCount", () => {
//   expect(JSON.stringify(screenMentsuCount([info1, info2, info3, info4]))).toBe(JSON.stringify([info1, info4]));
// });
