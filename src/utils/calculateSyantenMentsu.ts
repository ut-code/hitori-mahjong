import { Hai, haiToIndex } from "./hai.ts";

function tehaiToArray(tehai: Hai[]): number[] {
  const arr = new Array(34).fill(0);
  for (const hai of tehai) {
    const index = haiToIndex(hai) - 1;
    arr[index]++;
  }
  return arr;
}

export default function calculateShantenMentsu(tehai: Hai[]): number {
  const hand = tehaiToArray(tehai);
  if (hand.length !== 34) {
    throw new Error("Invalid hand length. The hand must be a 34-length array.");
  }

  function dfs(
    tiles: number[],
    melds: number,
    pairs: number,
    depth: number,
  ): number {
    let shanten = 8 - melds * 2 - pairs;
    for (let i = 0; i < 34; i++) {
      if (tiles[i] >= 3) {
        tiles[i] -= 3;
        shanten = Math.min(shanten, dfs(tiles, melds + 1, pairs, depth + 1));
        tiles[i] += 3;
      }
      if (
        i < 27 &&
        i % 9 <= 6 &&
        tiles[i] > 0 &&
        tiles[i + 1] > 0 &&
        tiles[i + 2] > 0
      ) {
        tiles[i]--;
        tiles[i + 1]--;
        tiles[i + 2]--;
        shanten = Math.min(shanten, dfs(tiles, melds + 1, pairs, depth + 1));
        tiles[i]++;
        tiles[i + 1]++;
        tiles[i + 2]++;
      }
    }

    for (let i = 0; i < 34; i++) {
      if (tiles[i] >= 2) {
        tiles[i] -= 2;
        shanten = Math.min(shanten, dfs(tiles, melds, pairs + 1, depth + 1));
        tiles[i] += 2;
      }
    }
    return shanten;
  }

  const initialShanten = dfs(hand, 0, 0, 0);
  return Math.max(0, initialShanten);
}
