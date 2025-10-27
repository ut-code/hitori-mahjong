import { expect, test } from "bun:test";
import {
	calculateSyantenFromCountInfo,
	compareInfo,
	incrementInfo,
	iterProduct,
	type MentsuCountInfo,
	screenMentsuCount,
} from "../src/utils/calculateSyantenMentsu";

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
	expect(JSON.stringify(screenMentsuCount([info1, info2, info3, info4]))).toBe(
		JSON.stringify([info1, info4]),
	);
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
	expect(JSON.stringify(incrementInfo(info3, false, true))).toBe(
		JSON.stringify(info4),
	);
});

test("check: iterProduct", () => {
	expect(
		JSON.stringify(iterProduct(["1", "2"], ["a", "b"], ["x", "y", "z"])),
	).toBe(
		JSON.stringify([
			["1", "a", "x"],
			["1", "a", "y"],
			["1", "a", "z"],
			["1", "b", "x"],
			["1", "b", "y"],
			["1", "b", "z"],
			["2", "a", "x"],
			["2", "a", "y"],
			["2", "a", "z"],
			["2", "b", "x"],
			["2", "b", "y"],
			["2", "b", "z"],
		]),
	);
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
