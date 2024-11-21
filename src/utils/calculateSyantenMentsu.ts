import judgeAgari from "./judgeAgari.ts";
import { Hai, JihaiValue, HaiKind, constructHai } from "./hai.ts";

export default function calculateShantenMentsu(tehai: Hai[]): number {
  // const machihai: Hai[] = [];
  // const haiKinds: HaiKind[] = ["manzu", "pinzu", "souzu", "jihai"];
  // const jihaiValues: JihaiValue[] = [
  //   "ton",
  //   "nan",
  //   "sya",
  //   "pei",
  //   "haku",
  //   "hatsu",
  //   "tyun",
  // ];
  // for (const kind of haiKinds) {
  //   if (kind === "jihai") {
  //     for (const value of jihaiValues) {
  //       const newHai: Hai = constructHai(kind, value);
  //       const newTehai: Hai[] = [...tehai, newHai];
  //       if (judgeAgari(newTehai)) {
  //         machihai.push(newHai);
  //       }
  //     }
  //   } else {
  //     for (let value = 1; value < 10; value++) {
  //       const newHai: Hai = constructHai(kind, value);
  //       const newTehai: Hai[] = [...tehai, newHai];
  //       if (judgeAgari(newTehai)) {
  //         machihai.push(newHai);
  //       }
  //     }
  //   }
  // }
  return 3 
}
