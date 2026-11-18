import { describe, expect, it } from "vitest";
import { getAgariScoreDelta } from "./score";

describe("getAgariScoreDelta", () => {
	it("returns 8000 for junme 1–6", () => {
		expect(getAgariScoreDelta(1)).toBe(8000);
		expect(getAgariScoreDelta(6)).toBe(8000);
	});

	it("returns 6400 for junme 7–12", () => {
		expect(getAgariScoreDelta(7)).toBe(6400);
		expect(getAgariScoreDelta(12)).toBe(6400);
	});

	it("returns 5200 for junme 13+", () => {
		expect(getAgariScoreDelta(13)).toBe(5200);
		expect(getAgariScoreDelta(18)).toBe(5200);
	});
});
