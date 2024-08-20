export default function createHaiyama() {
  class Hai {
    constructor(kind, value) {
      this.kind = kind; //m子、p子、s子、四風牌、三元牌
      this.value = value; //1~9, 東南西北白發中
    }
  }

  const KINDS = {
    SUUPAI: ["manzu", "pinzu", "souzu"],
    JIHAI: ["sufonpai", "sangenpai"],
  };

  const VALUES = {
    SUUPAI_VALUE: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    SUFONPAI_VALUE: [1, 2, 3, 4],
    SANGENPAI_VALUE: [1, 2, 3],
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const haiyamaGenerator = function* (kinds, values) {
    for (let kind of kinds) {
      for (let value of values) {
        for (let i = 0; i < 4; i++) {
          yield new Hai(kind, value);
        }
      }
    }
  };

  return shuffleArray([
    ...haiyamaGenerator(KINDS.SUUPAI, VALUES.SUUPAI_VALUE),
    ...haiyamaGenerator([KINDS.JIHAI[0]], VALUES.SUFONPAI_VALUE),
    ...haiyamaGenerator([KINDS.JIHAI[1]], VALUES.SANGENPAI_VALUE),
  ]);
}
