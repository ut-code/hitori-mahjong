import { expect, test } from "bun:test";
import {
	type HaiIndex,
	countHaiIndex,
	extractHai,
} from "../src/utils/calculateSyantenMentsu";

const tenpaiValue = [1, 2, 2, 3, 3, 4, 5, 5, 5, 6, 7, 8, 9];
const tenpai: HaiIndex = [1, 2, 2, 1, 3, 1, 1, 1, 1];

test("check: countHaiIndex", () => {
	expect(JSON.stringify(countHaiIndex(tenpaiValue))).toBe(
		JSON.stringify(tenpai),
	);
});

test("check: extractHai1", () => {
	expect(JSON.stringify(extractHai(tenpai, [3, 4, 5]))).toBe(
		JSON.stringify([1, 2, 2, 0, 2, 0, 1, 1, 1]),
	);
});

test("check: extractHai2", () => {
	expect(JSON.stringify(extractHai(tenpai, [7, 9]))).toBe(JSON.stringify(null));
});

test("check: extractHai3", () => {
	expect(JSON.stringify(extractHai(tenpai, [3, 3, 3]))).toBe(
		JSON.stringify(null),
	);
});
