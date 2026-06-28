import { describe, expect, it } from "vitest";
import { calculateShanten } from "./shanten";
import { constructHai, type Hai, type JihaiValue } from "./types";

// Helper to create suhai tiles
function manzu(value: number): Hai {
	return constructHai("manzu", value);
}

function pinzu(value: number): Hai {
	return constructHai("pinzu", value);
}

function souzu(value: number): Hai {
	return constructHai("souzu", value);
}

function jihai(value: JihaiValue): Hai {
	return constructHai("jihai", value);
}

describe("calculateShanten", () => {
	describe("14 tiles - Agari (winning hand)", () => {
		it("should recognize standard form win", () => {
			// Complete hand: 4 mentsu + 1 janto (14 tiles)
			const tehai: Hai[] = [
				// Janto (pair)
				manzu(1),
				manzu(1),
				// Koutsu (triplet)
				manzu(9),
				manzu(9),
				manzu(9),
				// Syuntsu (sequence)
				pinzu(1),
				pinzu(2),
				pinzu(3),
				// Syuntsu
				souzu(1),
				souzu(2),
				souzu(3),
				// Koutsu
				jihai("ton"),
				jihai("ton"),
				jihai("ton"),
			];

			const result = calculateShanten(tehai);
			expect(result.isAgari).toBe(true);
			expect(result.shanten).toBe(-1);
		});

		it("should recognize chiitoitsu win (7 pairs)", () => {
			const tehai: Hai[] = [
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
			];

			const result = calculateShanten(tehai);
			expect(result.isAgari).toBe(true);
			expect(result.shanten).toBe(-1);
		});

		it("should recognize mixed hand win", () => {
			// Another standard form win
			const tehai: Hai[] = [
				manzu(1),
				manzu(2),
				manzu(3),
				manzu(4),
				manzu(5),
				manzu(6),
				pinzu(7),
				pinzu(8),
				pinzu(9),
				pinzu(7),
				pinzu(8),
				pinzu(9),
				souzu(1),
				souzu(1),
			];

			const result = calculateShanten(tehai);
			expect(result.isAgari).toBe(true);
			expect(result.shanten).toBe(-1);
		});
	});

	describe("13 tiles - Tenpai (ready hand)", () => {
		it("should recognize tenpai in standard form", () => {
			// Waiting on one tile for complete hand
			const tehai: Hai[] = [
				// Janto
				manzu(1),
				manzu(1),
				// Two syuntsu
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(1),
				souzu(2),
				souzu(3),
				// One koutsu
				jihai("ton"),
				jihai("ton"),
				jihai("ton"),
				// Partial syuntsu (waiting for pinzu(2))
				pinzu(2),
				pinzu(3),
			];

			const result = calculateShanten(tehai);
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
			expect(result.isAgari).toBe(false);
		});

		it("should recognize tenpai waiting on multiple tiles", () => {
			// Classic tenpai: 1-4-7 wait
			const tehai: Hai[] = [
				manzu(1),
				manzu(1), // janto
				pinzu(1),
				pinzu(2),
				pinzu(3),
				pinzu(4),
				pinzu(5),
				pinzu(6),
				souzu(1),
				souzu(2),
				souzu(3),
				jihai("ton"),
				jihai("ton"),
			];

			const result = calculateShanten(tehai);
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
		});

		it("should recognize chiitoitsu tenpai (6 pairs)", () => {
			const tehai: Hai[] = [
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
				jihai("ton"), // Single tile waiting
			];

			const result = calculateShanten(tehai);
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
		});
	});

	describe("13 tiles - 1-shanten", () => {
		it("should calculate 1-shanten for standard form", () => {
			// Need 2 more tiles to complete
			const tehai: Hai[] = [
				manzu(1),
				manzu(1), // janto
				pinzu(1),
				pinzu(2),
				pinzu(3), // completed syuntsu
				souzu(1),
				souzu(2), // partial syuntsu
				jihai("ton"),
				jihai("ton"),
				jihai("ton"), // completed koutsu
				manzu(5),
				manzu(6), // partial syuntsu
				manzu(9), // isolated
			];

			const result = calculateShanten(tehai);
			expect(result.shanten).toBe(1);
			expect(result.isTenpai).toBe(false);
		});

		it("should calculate 1-shanten for chiitoitsu (5 pairs)", () => {
			const tehai: Hai[] = [
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
				jihai("ton"),
				jihai("nan"),
				jihai("sya"),
			];

			const result = calculateShanten(tehai);
			expect(result.shanten).toBe(1);
		});
	});

	describe("13 tiles - Higher shanten numbers", () => {
		it("should calculate 4-shanten for scattered tiles", () => {
			const tehai: Hai[] = [
				manzu(1),
				manzu(3),
				manzu(5),
				manzu(7),
				manzu(9),
				pinzu(1),
				pinzu(3),
				pinzu(5),
				pinzu(7),
				pinzu(9),
				souzu(1),
				souzu(5),
				jihai("ton"),
			];

			const result = calculateShanten(tehai);
			expect(result.shanten).toBe(4);
		});

		it("should calculate 4-shanten for isolated tiles with partial sequences", () => {
			// 13 tiles with some adjacent tiles but no complete sequences or pairs
			const tehai: Hai[] = [
				manzu(1),
				manzu(2),
				manzu(4),
				manzu(6),
				manzu(8),
				pinzu(1),
				pinzu(3),
				pinzu(5),
				pinzu(7),
				pinzu(9),
				souzu(2),
				souzu(4),
				jihai("ton"),
			];

			const result = calculateShanten(tehai);
			expect(result.shanten).toBe(4);
		});
	});

	describe("14 tiles - Shanten calculation", () => {
		it("should calculate 1-shanten for non-winning 14 tile hand", () => {
			const tehai: Hai[] = [
				manzu(1),
				manzu(1),
				manzu(2),
				manzu(3),
				pinzu(1),
				pinzu(2),
				pinzu(3),
				pinzu(4),
				pinzu(5),
				souzu(1),
				souzu(2),
				souzu(3),
				jihai("ton"),
				jihai("nan"),
			];

			const result = calculateShanten(tehai);
			expect(result.isAgari).toBe(false);
			expect(result.shanten).toBe(1);
		});

		it("should return shanten 0 for 14 tiles one discard from tenpai", () => {
			// 14 tiles that form a complete hand (agari)
			const tehai: Hai[] = [
				manzu(1),
				manzu(1), // janto
				pinzu(1),
				pinzu(2),
				pinzu(3), // syuntsu
				souzu(1),
				souzu(2),
				souzu(3), // syuntsu
				jihai("ton"),
				jihai("ton"),
				jihai("ton"), // koutsu
				manzu(5),
				manzu(6),
				manzu(7), // extra syuntsu
			];

			const result = calculateShanten(tehai);
			// This is actually a winning hand (4 mentsu + 1 janto)
			expect(result.isAgari).toBe(true);
			expect(result.shanten).toBe(-1);
		});

		it("should calculate shanten for 14 tiles that are not agari", () => {
			// 14 tiles that are NOT a winning hand
			const tehai: Hai[] = [
				manzu(1),
				manzu(1), // janto
				pinzu(1),
				pinzu(2),
				pinzu(3), // syuntsu
				souzu(1),
				souzu(2),
				souzu(3), // syuntsu
				jihai("ton"),
				jihai("ton"),
				jihai("ton"), // koutsu
				manzu(5),
				manzu(6),
				manzu(8), // incomplete - missing manzu(7)
			];

			const result = calculateShanten(tehai);
			expect(result.isAgari).toBe(false);
			// This should be tenpai (waiting on manzu(7))
			expect(result.shanten).toBe(0);
		});

		it("should calculate shanten based on 13 tiles even when given 14", () => {
			// 14 tiles - should try all possible discards and find best 13-tile shanten
			const tehai14: Hai[] = [
				manzu(1),
				manzu(2),
				manzu(3), // syuntsu
				pinzu(1),
				pinzu(2),
				pinzu(3), // syuntsu
				souzu(1),
				souzu(2),
				souzu(3), // syuntsu
				jihai("ton"),
				jihai("ton"),
				jihai("ton"), // koutsu
				manzu(5), // extra tile
				manzu(7), // extra tile (not connected)
			];

			const result14 = calculateShanten(tehai14);

			// Compare with 13-tile versions (removing each extra tile)
			const tehai13A = tehai14.filter((_, i) => i !== 12); // Remove manzu(5)
			const tehai13B = tehai14.filter((_, i) => i !== 13); // Remove manzu(7)

			const result13A = calculateShanten(tehai13A);
			const result13B = calculateShanten(tehai13B);

			// 14-tile result should be the minimum of all 13-tile possibilities
			const expectedMin = Math.min(result13A.shanten, result13B.shanten);
			expect(result14.shanten).toBe(expectedMin);
		});
	});

	describe("13 vs 14 tile distinction", () => {
		it("should handle 13 tile hand correctly (normal playing state)", () => {
			// Standard 13 tile hand, tenpai
			const tehai13: Hai[] = [
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
				manzu(6), // waiting on manzu(4) or manzu(7)
			];

			const result = calculateShanten(tehai13);
			expect(result.isAgari).toBe(false); // Can't win with 13 tiles
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
		});

		it("should handle 14 tile hand for agari check (after drawing)", () => {
			// Same hand but with drawn tile (14 tiles) - should be agari
			const tehai14: Hai[] = [
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
				manzu(7), // completed the syuntsu
			];

			const result = calculateShanten(tehai14);
			expect(result.isAgari).toBe(true); // Should recognize win
			expect(result.shanten).toBe(-1);
		});

		it("should distinguish between 13 tile tenpai and 14 tile agari", () => {
			// 13 tiles waiting
			const tehai13: Hai[] = [
				manzu(1),
				manzu(1),
				manzu(2),
				manzu(3),
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(1),
				souzu(2),
				souzu(3),
				jihai("ton"),
				jihai("ton"),
				jihai("ton"),
			];

			const result13 = calculateShanten(tehai13);
			expect(result13.isAgari).toBe(false);
			expect(result13.isTenpai).toBe(true);
			expect(result13.shanten).toBe(0);

			// Same hand + winning tile (14 tiles)
			const tehai14: Hai[] = [...tehai13, manzu(4)];

			const result14 = calculateShanten(tehai14);
			expect(result14.isAgari).toBe(true);
			expect(result14.shanten).toBe(-1);
		});
	});

	describe("Edge cases", () => {
		it("should handle honor tiles correctly", () => {
			const tehai: Hai[] = [
				jihai("ton"),
				jihai("ton"),
				jihai("ton"),
				jihai("nan"),
				jihai("nan"),
				jihai("nan"),
				jihai("sya"),
				jihai("sya"),
				jihai("sya"),
				jihai("pei"),
				jihai("pei"),
				jihai("haku"),
				jihai("haku"),
			];

			const result = calculateShanten(tehai);
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
		});

		it("should handle four identical tiles correctly", () => {
			// Hand with 4 of the same tile (kan possibility)
			const tehai: Hai[] = [
				manzu(1),
				manzu(1),
				manzu(1),
				manzu(1), // 4 identical tiles
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(1),
				souzu(2),
				souzu(3),
				jihai("ton"),
				jihai("ton"),
				jihai("ton"),
			];

			const result = calculateShanten(tehai);
			// Can form 3 syuntsu + 1 koutsu + janto candidate = tenpai
			expect(result.shanten).toBe(0);
		});

		it("should handle empty hand gracefully", () => {
			const tehai: Hai[] = [];
			const result = calculateShanten(tehai);
			// Empty hand has maximum shanten
			expect(result.shanten).toBe(8);
		});

		it("should reject hands with more than 4 of the same tile", () => {
			// Invalid hand: 5 identical tiles (impossible in real game)
			const tehai: Hai[] = [
				manzu(1),
				manzu(1),
				manzu(1),
				manzu(1),
				manzu(1), // 5th tile - invalid!
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(1),
				souzu(2),
				souzu(3),
				jihai("ton"),
				jihai("ton"),
			];

			expect(() => calculateShanten(tehai)).toThrow(
				"Invalid hand: a tile appears more than 4 times",
			);
		});

		it("should accept hands with exactly 4 of the same tile", () => {
			// Valid hand with 4 identical tiles
			const tehai: Hai[] = [
				manzu(1),
				manzu(1),
				manzu(1),
				manzu(1), // 4 identical tiles (valid)
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(1),
				souzu(2),
				souzu(3),
				jihai("ton"),
				jihai("ton"),
				jihai("ton"),
			];

			const result = calculateShanten(tehai);
			expect(result.shanten).toBe(0);
		});
		it("should handle closed waits correctly", () => {
			// Penchan wait (edge wait)
			const tehai: Hai[] = [
				manzu(1),
				manzu(1), // janto
				manzu(8),
				manzu(9), // penchan wait for manzu(7)
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(1),
				souzu(2),
				souzu(3),
				jihai("ton"),
				jihai("ton"),
				jihai("ton"),
			];

			const result = calculateShanten(tehai);
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
		});

		it("should handle kanchan wait (middle wait)", () => {
			const tehai: Hai[] = [
				manzu(1),
				manzu(1), // janto
				manzu(4),
				manzu(6), // kanchan wait for manzu(5)
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(1),
				souzu(2),
				souzu(3),
				jihai("ton"),
				jihai("ton"),
				jihai("ton"),
			];

			const result = calculateShanten(tehai);
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
		});

		it("should handle shaanpon wait (dual pair wait)", () => {
			const tehai: Hai[] = [
				manzu(1),
				manzu(1),
				manzu(2),
				manzu(2), // shaanpon wait for manzu(1) or manzu(2)
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(1),
				souzu(2),
				souzu(3),
				jihai("ton"),
				jihai("ton"),
				jihai("ton"),
			];

			const result = calculateShanten(tehai);
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
		});
	});

	describe("Known standard shanten values", () => {
		it("should return 1-shanten for 1-2-3-4-5-6-7-8-9 pattern", () => {
			// Nine Gates wait pattern (13 tiles)
			const tehai: Hai[] = [
				manzu(1),
				manzu(1),
				manzu(2),
				manzu(3),
				manzu(4),
				manzu(5),
				manzu(6),
				manzu(7),
				manzu(8),
				manzu(9),
				manzu(9),
				manzu(9),
				pinzu(1), // extra tile
			];

			const result = calculateShanten(tehai);
			expect(result.shanten).toBe(1);
		});

		it("should handle repeated sequences correctly", () => {
			const tehai: Hai[] = [
				manzu(1),
				manzu(2),
				manzu(3),
				manzu(1),
				manzu(2),
				manzu(3),
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(1),
				souzu(2),
				souzu(3),
				manzu(4), // waiting tile
			];

			const result = calculateShanten(tehai);
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
		});
	});

	describe("Chiitoitsu vs Standard form", () => {
		it("should choose minimum shanten between forms", () => {
			// Hand that's better for chiitoitsu
			const tehai: Hai[] = [
				manzu(1),
				manzu(1),
				manzu(5),
				manzu(5),
				pinzu(3),
				pinzu(3),
				pinzu(7),
				pinzu(7),
				souzu(2),
				souzu(2),
				jihai("ton"),
				jihai("ton"),
				jihai("nan"), // single tile
			];

			const result = calculateShanten(tehai);
			// Should be chiitoitsu tenpai (0 shanten)
			expect(result.shanten).toBe(0);
		});

		it("should prefer standard form when better", () => {
			const tehai: Hai[] = [
				manzu(1),
				manzu(2),
				manzu(3),
				manzu(4),
				manzu(5),
				manzu(6),
				pinzu(1),
				pinzu(2),
				pinzu(3),
				souzu(7),
				souzu(8),
				souzu(9),
				manzu(7), // waiting
			];

			const result = calculateShanten(tehai);
			expect(result.isTenpai).toBe(true);
			expect(result.shanten).toBe(0);
		});
	});
});
