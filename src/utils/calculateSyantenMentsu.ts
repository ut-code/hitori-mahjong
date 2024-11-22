import { Hai, HaiKind } from "./hai.ts";

type MentsuStructureInfo = {
  mentsu: number
  taatsu: number
  haveToitsu: boolean
}

export default function calculateShantenMentsu(tehai: Hai[]): number {
  const haiKinds: HaiKind[] = ["manzu", "pinzu", "souzu", "jihai"];
  const infoList: MentsuStructureInfo[][] = [];
  for (const kind of haiKinds) {
    infoList.push([]);
    const targetTehaiValue = tehai.filter(hai => hai.kind === kind).map(hai => hai.value);
    if (kind === "jihai") {
      const haiNumber = targetTehaiValue.map(
        v => tehai.filter(h => h.value === v).length
      );
      const info: MentsuStructureInfo = {
        mentsu: haiNumber.filter(num => num >= 3).length,
        taatsu: haiNumber.filter(num => num === 2).length,
        haveToitsu: Boolean(haiNumber.filter(num => num === 2).length),
      };
      infoList.at(-1)?.push(info);
    } else {
      const haiNumber = countHaiNumber(targetTehaiValue as number[]);
      const info = calculateMentsuCandidate(haiNumber);
      infoList.at(-1)?.push(info);
    }
  }
  return calculateSyantenFromStructureInfo(infoList);
}

// 返り値は9要素のarrayで、各要素は数牌の枚数
function countHaiNumber(targetTehaiValue: number[]): number[] {
  return Array(9).fill(0).map((v, i) => i + 1).map(
    i => targetTehaiValue.filter(v => v === i).length
  );
}

function calculateMentsuCandidate(haiNumber: number[]): MentsuStructureInfo {
  // TODO
  return {
    mentsu: 1,
    taatsu: 0,
    haveToitsu: false,
  };
}

function iterProduct<T>(...arrays: T[][]) {
  return arrays.reduce(
    (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
    [[]] as T[][]
  );
}

function calculateSyantenFromStructureInfo(infoList: MentsuStructureInfo[][]): number {
  const syantenCandidate: number[] = []
  for (const infoSet of iterProduct(...infoList)) {
    const infoSummary = infoSet.reduce((p, c) => {
      return {
        mentsu: p.mentsu + c.mentsu, 
        taatsu: p.taatsu + c.taatsu,
        haveToitsu: p.haveToitsu || c.haveToitsu, 
      }
    });
    syantenCandidate.push(
      8
      - infoSummary.mentsu * 2
      - infoSummary.taatsu
      - Math.max(
        0,
        infoSummary.mentsu
        + infoSummary.taatsu
        - Number(infoSummary.haveToitsu)
        - 4
      )
    );
  }
  return Math.min(...syantenCandidate);
}