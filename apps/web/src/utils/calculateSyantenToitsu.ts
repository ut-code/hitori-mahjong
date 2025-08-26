import type { Hai } from "shared/hai";

export default function calculateSyantenToitsu(tehai: Hai[]): number {
	const tehaiSet: Hai[] = [];
	for (const hai of tehai) {
		if (!tehaiSet.filter((v) => sameHai(v, hai)).length) {
			tehaiSet.push(hai);
		}
	}
	const haiNumber = tehaiSet.map(
		(hai) => tehai.filter((h) => sameHai(hai, h)).length,
	);
	return (
		6 -
		haiNumber.filter((n) => n >= 2).length +
		Math.max(0, 7 - [...tehaiSet].length)
	);
}

function sameHai(a: Hai, b: Hai): boolean {
	return a.kind === b.kind && a.value === b.value;
}
