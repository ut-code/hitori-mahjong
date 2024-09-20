export type Hai =
  | {
      kind: "manzu" | "pinzu" | "souzu";
      value: number;
    }
  | {
      kind: "jihai";
      value: JihaiValue;
    };

export function haiToIndex(hai: Hai): number {
  const kindOrder = {
    manzu: 0,
    pinzu: 1,
    souzu: 2,
    jihai: 3,
  };

  const jihaiOrder = {
    ton: 1,
    nan: 2,
    sya: 3,
    pei: 4,
    haku: 5,
    hatsu: 6,
    tyun: 7,
  };
  return 9 * kindOrder[hai.kind] + hai.kind === "jihai" ? jihaiOrder[hai.value] : hai.value
}

export type JihaiValue =
  | "ton"
  | "nan"
  | "sya"
  | "pei"
  | "haku"
  | "hatsu"
  | "tyun";

export function constructHai(
  kind: "manzu" | "pinzu" | "souzu" | "jihai",
  value: number | JihaiValue,
): Hai {
  if (kind === "manzu" || kind === "pinzu" || kind === "souzu") {
    if (typeof value === "number") {
      return {
        kind,
        value,
      };
    }
    throw new Error("suhai requires number");
  }
  if (typeof value === "string") {
    return {
      kind,
      value,
    };
  }
  throw new Error("jihai requires JihaiValue");
}

export function sortTehai(haiArray: Hai[]): Hai[] {
  return haiArray.sort((a, b) => 
    haiToIndex(a) - haiToIndex(b)
  );
}
