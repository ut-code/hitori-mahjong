import { describe, expect, it } from "vitest";

import {
	calcChiitoiShanten,
	calcStandardShanten,
	calculateShanten,
} from "./shanten";
import { constructHai, type Hai, type JihaiValue } from "./types";

const m = (value: number): Hai => constructHai("manzu", value);
const p = (value: number): Hai => constructHai("pinzu", value);
const s = (value: number): Hai => constructHai("souzu", value);
const z = (value: JihaiValue): Hai => constructHai("jihai", value);

describe("calcStandardShanten", () => {
	it("内部関数は13枚以外を対象外として 8 を返す", () => {
		const tehai: Hai[] = [
			m(1),
			m(1),
			m(1),
			m(2),
			m(3),
			m(4),
			p(5),
			p(6),
			p(7),
			s(7),
			s(8),
			s(9),
			z("ton"),
			z("ton"),
		];
		expect(calcStandardShanten(tehai)).toBe(8);
	});

	it("テンパイ形は 0", () => {
		const tehai: Hai[] = [
			m(1),
			m(1),
			m(1),
			m(2),
			m(3),
			m(4),
			p(5),
			p(6),
			p(7),
			s(7),
			s(8),
			s(9),
			z("ton"),
		];
		expect(calcStandardShanten(tehai)).toBe(0);
	});

	it("イーシャンテン形は 1", () => {
		const tehai: Hai[] = [
			m(1),
			m(1),
			m(1),
			m(2),
			m(3),
			m(4),
			p(5),
			p(6),
			p(7),
			z("ton"),
			z("ton"),
			z("nan"),
			z("haku"),
		];
		expect(calcStandardShanten(tehai)).toBe(1);
	});

	it("配牌時の典型的なバラバラ手は 8", () => {
		const tehai: Hai[] = [
			m(1),
			m(4),
			m(7),
			p(2),
			p(5),
			p(8),
			s(3),
			s(6),
			s(9),
			z("ton"),
			z("nan"),
			z("haku"),
			z("hatsu"),
		];
		expect(calcStandardShanten(tehai)).toBe(8);
	});
});

describe("calcChiitoiShanten", () => {
	it("内部関数は13枚以外を対象外として 8 を返す", () => {
		const tehai: Hai[] = [
			m(1),
			m(1),
			m(2),
			m(2),
			p(3),
			p(3),
			p(4),
			p(4),
			s(5),
			s(5),
			s(6),
			s(6),
			z("ton"),
			z("ton"),
		];
		expect(calcChiitoiShanten(tehai)).toBe(8);
	});

	it("七対子のテンパイ形は 0", () => {
		const tehai: Hai[] = [
			m(1),
			m(1),
			m(2),
			m(2),
			p(3),
			p(3),
			p(4),
			p(4),
			s(5),
			s(5),
			s(6),
			s(6),
			z("ton"),
		];
		expect(calcChiitoiShanten(tehai)).toBe(0);
	});

	it("七対子のイーシャンテン形は 1", () => {
		const tehai: Hai[] = [
			m(1),
			m(1),
			m(2),
			m(2),
			p(3),
			p(3),
			p(4),
			p(4),
			s(5),
			s(5),
			s(6),
			z("ton"),
			z("nan"),
		];
		expect(calcChiitoiShanten(tehai)).toBe(1);
	});
});

describe("calculateShanten", () => {
	it("メンツ手上がりを正しく上がり判定する", () => {
		const tehai: Hai[] = [
			m(1),
			m(1),
			m(1),
			m(2),
			m(3),
			m(4),
			p(5),
			p(6),
			p(7),
			s(7),
			s(8),
			s(9),
			z("ton"),
			z("ton"),
		];
		expect(calculateShanten(tehai)).toEqual({
			shanten: -1,
			isTenpai: false,
			isAgari: true,
		});
	});

	it("七対子上がりを正しく上がり判定する", () => {
		const tehai: Hai[] = [
			m(1),
			m(1),
			m(2),
			m(2),
			p(3),
			p(3),
			p(4),
			p(4),
			s(5),
			s(5),
			s(6),
			s(6),
			z("ton"),
			z("ton"),
		];
		expect(calculateShanten(tehai)).toEqual({
			shanten: -1,
			isTenpai: false,
			isAgari: true,
		});
	});

	it("14枚非アガり時は13枚基準の最小シャンテンを返す", () => {
		const tehai: Hai[] = [
			m(1),
			m(1),
			m(1),
			m(2),
			m(3),
			m(4),
			p(5),
			p(6),
			p(7),
			s(7),
			s(8),
			s(9),
			z("ton"),
			z("nan"),
		];
		expect(calculateShanten(tehai)).toEqual({
			shanten: 0,
			isTenpai: true,
			isAgari: false,
		});
	});
});
