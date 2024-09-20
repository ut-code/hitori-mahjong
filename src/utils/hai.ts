export type Hai =
  | {
      kind: "manzu" | "pinzu" | "souzu";
      value: number;
    }
  | {
      kind: "jihai";
      value: JihaiValue;
    };

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

export function sortHai(haiArray: Hai[]): Hai[] {
  const kindOrder = {
    manzu: 1,
    pinzu: 2,
    souzu: 3,
    zihai: 4,
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

  return haiArray.sort((a, b) => {
    const kindComparison = kindOrder[a.kind] - kindOrder[b.kind];
    if (kindComparison !== 0) {
      return kindComparison;
    }

    if (a.kind === "jihai" && b.kind === "jihai") {
      return jihaiOrder[a.value] - jihaiOrder[b.value]; //ブラケット記法...
    } else if (typeof a.value === "number" && typeof b.value === "number") {
      return a.value - b.value;
    }
  });
}
