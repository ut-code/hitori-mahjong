import { Hai, constructHai, JihaiValue } from "../src/utils/hai.js";

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function createHaiyama(): Hai[] {
  const kinds = ["manzu", "pinzu", "souzu", "jihai"];
  const jihaiValues: JihaiValue[] = [
    "ton",
    "nan",
    "sya",
    "pei",
    "haku",
    "hatsu",
    "tyun",
  ];
  let sortedHaiyama: Hai[] = [];

  for (const kind of kinds) {
    if (kind === "jihai") {
      sortedHaiyama = sortedHaiyama.concat(
        ...jihaiValues.map((value) => {
          return new Array<Hai>(4).fill(constructHai("jihai", value));
        }),
      );
    } else if (kind === "manzu" || kind === "manzu" || kind === "pinzu") {
      for (let value = 1; value < 10; value++) {
        sortedHaiyama = sortedHaiyama.concat(
          new Array<Hai>(4).fill(constructHai(kind, value)),
        );
      }
    }
  }
  return shuffleArray(sortedHaiyama);
}
