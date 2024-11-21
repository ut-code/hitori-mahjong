import { Hai } from "./hai.ts";

export default function calculateShantenToitsu(tehai: Hai[]): number {
  const tehaiSet = new Set(tehai);
  const haiNumber = [...tehaiSet].map(hai => tehai.filter(
    h => ((h.kind === hai.kind) && h.value === hai.value)).length
  );
  return haiNumber.filter(n => n >= 2).length - Math.max(0, 7 - [...tehaiSet].length)
}
