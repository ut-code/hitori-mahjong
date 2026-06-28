import type { Hai } from "@/lib/hai/types";

export function getHaiKey(hai: Hai): string {
	return `${hai.kind}-${hai.value}`;
}

export function shantenLabel(shanten: number): string {
	if (shanten === -1) return "和了";
	if (shanten === 0) return "テンパイ";
	return `${shanten}シャンテン`;
}
