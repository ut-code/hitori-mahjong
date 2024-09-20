type Hai = {
  kind: string,
  value: number,
}
export default function createHaiyama(): Hai[] {
  class Hai {
    kind: string; // m子、p子、s子、四風牌、三元牌
    value: number; // 1~9, 東南西北白發中

    constructor(kind: string, value: number) {
      this.kind = kind;
      this.value = value;
    }
  }

  const KINDS = {
    SUUPAI: ["manzu", "pinzu", "souzu"] as const,
    JIHAI: ["sufonpai", "sangenpai"] as const,
  };

  const VALUES = {
    SUUPAI_VALUE: [1, 2, 3, 4, 5, 6, 7, 8, 9] as const,
    SUFONPAI_VALUE: [1, 2, 3, 4] as const,
    SANGENPAI_VALUE: [1, 2, 3] as const,
  };

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function* haiyamaGenerator(kinds: readonly string[], values: readonly number[]): Generator<Hai> {
    for (let kind of kinds) {
      for (let value of values) {
        for (let i = 0; i < 4; i++) {
          yield new Hai(kind, value);
        }
      }
    }
  }

  return shuffleArray([
    ...Array.from(haiyamaGenerator(KINDS.SUUPAI, VALUES.SUUPAI_VALUE)),
    ...Array.from(haiyamaGenerator([KINDS.JIHAI[0]], VALUES.SUFONPAI_VALUE)),
    ...Array.from(haiyamaGenerator([KINDS.JIHAI[1]], VALUES.SANGENPAI_VALUE)),
  ]);
}
