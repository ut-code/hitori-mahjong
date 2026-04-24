import { describe, expect, it } from "vitest";
import { haiToIndex, indexToHai, type JihaiValue } from "./types";

describe("indexToHai", () => {
	it("converts all valid indexes to tiles and back", () => {
		for (let index = 1; index <= 34; index++) {
			expect(haiToIndex(indexToHai(index))).toBe(index);
		}
	});

	it("maps honor tile indexes correctly", () => {
		const jihaiByIndex: Record<number, JihaiValue> = {
			28: "ton",
			29: "nan",
			30: "sya",
			31: "pei",
			32: "haku",
			33: "hatsu",
			34: "tyun",
		};

		for (const [indexText, value] of Object.entries(jihaiByIndex)) {
			const index = Number(indexText);
			expect(indexToHai(index)).toEqual({ kind: "jihai", value });
		}
	});
});
