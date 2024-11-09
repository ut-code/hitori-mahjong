import judgeAgari from "./judgeAgari";
import { Hai, JihaiValue } from "./hai.ts";
export default function calculateMachihai(tehai: Hai[]): Hai[] {
    const machihai = [];
    const haiKinds = ["manzu", "pinzu", "souzu", "jihai"];
    const jihaiValues: JihaiValue[] = ["ton", "nan", "sya", "pei", "haku", "hatsu", "tyun"];
    for (const kind of haiKinds) {
        if (kind === "jihai") {
            for (const value of jihaiValues) {
                const newTehai = tehai.push({kind: kind, value: value})
            }
        }
    }
}