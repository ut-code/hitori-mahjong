import { expect, test } from "bun:test";
import {
	type HaiIndex,
	type MentsuCountInfo,
	calculateCountInfo,
	calculateInfo,
	screenMentsuCount,
} from "../src/utils/calculateSyantenMentsu";

const index1: HaiIndex = [1, 0, 3, 1, 3, 0, 1, 0, 0];
const index2: HaiIndex = [0, 0, 3, 1, 3, 0, 1, 0, 0];
const index3: HaiIndex = [0, 0, 2, 1, 3, 0, 1, 0, 0];
const index4: HaiIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const info1: MentsuCountInfo = {
	mentsu: 2,
	candidate: 1,
	haveToitsu: false,
};
const info2: MentsuCountInfo = {
	mentsu: 1,
	candidate: 3,
	haveToitsu: false,
};
const info3: MentsuCountInfo = {
	mentsu: 0,
	candidate: 0,
	haveToitsu: false,
};
const info4: MentsuCountInfo = {
	mentsu: 0,
	candidate: 1,
	haveToitsu: false,
};
const info5: MentsuCountInfo = {
	mentsu: 2,
	candidate: 0,
	haveToitsu: false,
};

test("check: calculateCountInfo", () => {
	expect(JSON.stringify(screenMentsuCount(calculateCountInfo(index1)))).toBe(
		JSON.stringify([info2, info5]),
	);
});

test("check: calculateInfo1", () => {
	expect(JSON.stringify(calculateInfo(index4, info1))).toBe(
		JSON.stringify([[index4, info1]]),
	);
});

test("check: calculateInfo2", () => {
	expect(JSON.stringify(calculateInfo(index1, info3))).toBe(
		JSON.stringify([
			...calculateInfo(index3, info4),
			...calculateInfo(index2, info3),
		]),
	);
});
