import { describe, expect, it } from "vitest";
import type { Hai } from "@/types/hai";
import judgeAgari from "./agari";
import { constructHai, sortTehai } from "./hai";

function manzu(v: number): Hai {
	return constructHai("manzu", v);
}
function pinzu(v: number): Hai {
	return constructHai("pinzu", v);
}
function souzu(v: number): Hai {
	return constructHai("souzu", v);
}
function jihai(
	v: "ton" | "nan" | "sya" | "pei" | "haku" | "hatsu" | "tyun",
): Hai {
	return constructHai("jihai", v);
}

describe("judgeAgari", () => {
	it("recognizes a standard 4-mentsu 1-janto hand", () => {
		const tehai = sortTehai([
			manzu(1),
			manzu(1),
			pinzu(1),
			pinzu(2),
			pinzu(3),
			souzu(1),
			souzu(2),
			souzu(3),
			jihai("ton"),
			jihai("ton"),
			jihai("ton"),
			manzu(5),
			manzu(6),
			manzu(7),
		]);
		expect(judgeAgari(tehai)).toBe(true);
	});

	it("recognizes chiitoitsu (7 pairs)", () => {
		const tehai = sortTehai([
			manzu(1),
			manzu(1),
			manzu(3),
			manzu(3),
			pinzu(2),
			pinzu(2),
			pinzu(5),
			pinzu(5),
			souzu(1),
			souzu(1),
			souzu(7),
			souzu(7),
			jihai("ton"),
			jihai("ton"),
		]);
		expect(judgeAgari(tehai)).toBe(true);
	});

	it("returns false for an incomplete hand", () => {
		const tehai = sortTehai([
			manzu(1),
			manzu(2),
			pinzu(1),
			pinzu(2),
			pinzu(3),
			souzu(1),
			souzu(2),
			souzu(3),
			jihai("ton"),
			jihai("ton"),
			jihai("ton"),
			manzu(5),
			manzu(6),
			manzu(8),
		]);
		expect(judgeAgari(tehai)).toBe(false);
	});

	it("returns false for tenpai (not yet complete)", () => {
		const tehai = sortTehai([
			manzu(1),
			manzu(1),
			pinzu(1),
			pinzu(2),
			pinzu(3),
			souzu(1),
			souzu(2),
			souzu(3),
			jihai("ton"),
			jihai("ton"),
			jihai("ton"),
			manzu(5),
			manzu(6),
		]);
		expect(judgeAgari(tehai)).toBe(false);
	});
});
