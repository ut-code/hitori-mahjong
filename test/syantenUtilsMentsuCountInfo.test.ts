import { expect, test } from "bun:test";
import { screenMentsuCount, compareInfo, incrementInfo, calculateSyantenFromCountInfo, MentsuCountInfo } from "../src/utils/calculateSyantenMentsu";
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

test("check: screenMentsuCount", () => {
  expect(JSON.stringify(screenMentsuCount([info1, info2, info3, info4]))).toBe(JSON.stringify([info1, info4]));
});

test("check: compareInfo1", () => {
  expect(compareInfo(info1, info2)).toBe(true);
});

test("check: compareInfo2", () => {
  expect(compareInfo(info1, info4)).toBe(undefined);
});

test("check: compareInfo3", () => {
  expect(compareInfo(info3, info4)).toBe(false);
});

test("check: incrementInfo", () => {
  expect(JSON.stringify(incrementInfo(info3, false, true))).toBe(JSON.stringify(info4));
});

test("check: calculateSyantenFromCountInfo1", () => {
  expect(calculateSyantenFromCountInfo([[info2]])).toBe(3);
});

test("check: calculateSyantenFromCountInfo2", () => {
  expect(calculateSyantenFromCountInfo([[info2], [info5]])).toBe(3);
});

test("check: calculateSyantenFromCountInfo3", () => {
  expect(calculateSyantenFromCountInfo([[info1, info4], [info5]])).toBe(2);
});
