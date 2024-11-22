import { Hai } from "./hai.ts";

export default function calculateShantenToitsu(tehai: Hai[]): number {
  const haiCountMap = new Map<string, number>();

  for (const hai of tehai) {
    const key = `${hai.kind}:${hai.value}`;
    const count = haiCountMap.get(key) || 0;
    haiCountMap.set(key, count + 1);
  }

  let numOfToitsu = 0;
  for (const value of haiCountMap.values()) {
    if (value === 2) {
      numOfToitsu += 1;
    }
  }

  return 6 - numOfToitsu;
}
