import calculateMachihai from "./calculateMachihai";
import { Hai, indexToHai, constructHai } from "./hai";
export default function judgeIisyanten(tehai: Hai[]): boolean {
  for (let i = 0; i < tehai.length; i++) {
    const temp = [...tehai];
    temp.splice(i, 1);
    for (let j = 1; j < 35; j++) {
      const newTemp = [...temp, indexToHai(j)];
      if (calculateMachihai(newTemp).length !== 0) {
        return true;
      }
    }
  }
  return false;
}
