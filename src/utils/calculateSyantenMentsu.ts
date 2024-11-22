import { Hai, HaiKind } from "./hai.ts";

/** 抜き出した面子と面子候補の数、及び対子を含むかの情報 */
type MentsuCountInfo = {
  mentsu: number
  candidate: number
  haveToitsu: boolean
}

/**
 * 面子手のシャンテン数を計算する
 * @param tehai 
 * @returns 
 */
export default function calculateShantenMentsu(tehai: Hai[]): number {
  const haiKinds: HaiKind[] = ["manzu", "pinzu", "souzu", "jihai"];
  /** info[各牌種の中で取りうる最高効率のもののリスト][牌種] */
  const infoCandidate: MentsuCountInfo[][] = [];
  for (const kind of haiKinds) {
    const targetTehaiValue = tehai.filter(hai => hai.kind === kind).map(hai => hai.value);
    if (kind === "jihai") {
      const haiNumber = targetTehaiValue.map(
        v => tehai.filter(h => h.value === v).length
      );
      const info: MentsuCountInfo = {
        mentsu: haiNumber.filter(num => num >= 3).length,
        candidate: haiNumber.filter(num => num === 2).length,
        haveToitsu: Boolean(haiNumber.filter(num => num === 2).length),
      };
      infoCandidate.push([info]);
    } else {
      const haiIndex = countHaiIndex(targetTehaiValue as number[]);
      const infoCandidatePartial = calculateStructureInfo(haiIndex);
      infoCandidate.push(infoCandidatePartial);
    }
  }
  return calculateSyantenFromCountInfo(infoCandidate);
}

/** 各数牌の枚数を要素に持つ9要素のarray */
type HaiIndex = number[];

/**
 * データ形式変換
 * @param targetTehaiValue 数牌[枚数]
 * @returns 枚数[数牌の数-1]
 */
function countHaiIndex(targetTehaiValue: number[]): HaiIndex {
  return Array(9).fill(0).map((v, i) => i + 1).map(
    i => targetTehaiValue.filter(v => v === i).length
  );
}

/**
 * 手牌から面子/面子候補として取り出せる個数を得る
 * @param haiIndex 
 * @returns 
 */
function calculateStructureInfo(haiIndex: HaiIndex): MentsuCountInfo[] {
  // 孤立牌を除く
  const simplifiedHaiIndex = haiIndex.map(
    (v, i, a) => (a[i-2] || a[i-1] || (v-1) || a[i+1] || a[i+2]) ? v : 0
  );

  // 面子/面子候補の情報を得る
  const infoDump = calculateInfo(
    simplifiedHaiIndex,
    {
      mentsu: 0,
      candidate: 0,
      haveToitsu: false,
    },
  ).map(([haiIndex, info]) => info);

  // 効率の良いものに絞る
  return screenMentsuCount(infoDump);
}

/**
 * 最も効率の良い面子/面子候補の切り出し方を絞り込む
 * @param infoCandidate 
 * @returns 
 */
function screenMentsuCount(infoCandidate: MentsuCountInfo[]): MentsuCountInfo[] {
  const result: MentsuCountInfo[] = [];
  for (const info of infoCandidate) {
    let insertFlag: boolean | undefined = undefined;
    for (const [index, infoForComparision] of result.entries()) {
      // 構築の方法により、同じresultの要素に対しisBetterはtrueかfalseの高々片方しかとらない
      const isBetter = compareInfo(info, infoForComparision);
      if (isBetter) {
        insertFlag = true;
        result.splice(index, 1);
        continue;
      }
      if (isBetter !== undefined) {
        insertFlag = false;
        break;
      }
    }
    if (insertFlag ?? true) {
      result.push(info);
    }
  }
  return result;
}

/**
 * aのほうがbよりも効率の良い面子/面子候補の取り出し方であるか
 * 順序が定義できない場合undefined
 * @param a 
 * @param b 
 * @returns
 */
function compareInfo(a: MentsuCountInfo, b: MentsuCountInfo): boolean | undefined {
  const mentsuDiff = a.mentsu - b.mentsu;
  const candidateDiff = a.candidate - b.candidate;
  const haveToitsuDiff = Number(a.haveToitsu) - Number(b.haveToitsu);

  const index1 = mentsuDiff * 2 - candidateDiff;
  const index2 = mentsuDiff * 4 - candidateDiff;

  return (index1 * index2 < 0) ? undefined : (index1 || index2) ? (index1 + index2) > 0 : haveToitsuDiff > 0;
}

/**
 * 手牌を面子および面子候補へと分解する場合、手牌に存在する任意の牌は以下のいずれかになる
 * 1. 順子として使われる
 * 1-1. 順子の下(左)側
 * 1-2. 順子の中央
 * 1-3. 順子の上(右)側
 * 2. 刻子として使われる
 * 3. 塔子として使われる
 * 3-1. 塔子の下(左)側
 * 3-1-1. 嵌張塔子の下側
 * 3-1-2. 両面/辺張塔子の下側
 * 3-2. 塔子の上(右)側
 * 3-2-1. 嵌張塔子の上側
 * 3-2-2. 両面/辺張塔子の上側
 * 4. 対子として使われる
 * 5. 使われない
 *
 * このうち、下側から走査することによって1-2, 1-3, 3-2は除外できる
 * 
 * 多分とんでもなく重い(動作がままならないならTODO: メモ化)
 * @param haiIndex 
 * @param info 
 * @returns 
 */
function calculateInfo(
  haiIndex: HaiIndex | null,
  info: MentsuCountInfo
): [HaiIndex, MentsuCountInfo][] {
  if (!haiIndex) {
    return [];
  }
  if (!haiIndex.length) {
    return [[haiIndex, info]];
  }
  const result: [HaiIndex, MentsuCountInfo][] = [];
  // 手牌の中の最小の数
  const minIndex = haiIndex.findIndex(v => v) + 1;
  // 1-1.
  result.push(
    ...calculateInfo(
      extractHai(haiIndex, [minIndex, minIndex + 1, minIndex + 2]),
      incrementInfo(info, true, false),
    )
  );
  // 2.
  result.push(
    ...calculateInfo(
      extractHai(haiIndex, [minIndex, minIndex, minIndex]),
      incrementInfo(info, true, false),
    )
  );
  // 3-1-1.
  result.push(
    ...calculateInfo(
      extractHai(haiIndex, [minIndex, minIndex + 2]),
      incrementInfo(info, false, false),
    )
  );
  // 3-1-2.
  result.push(
    ...calculateInfo(
      extractHai(haiIndex, [minIndex, minIndex + 1]),
      incrementInfo(info, false, false),
    )
  );
  // 4.
  result.push(
    ...calculateInfo(
      extractHai(haiIndex, [minIndex, minIndex]),
      incrementInfo(info, false, true),
    )
  );
  // 5.
  result.push(...calculateInfo(extractHai(haiIndex, [minIndex]), info));

  return result;
}

/**
 * 一種の数牌の集合から特定の牌を抜き出す。不正な場合null
 * @param haiIndex 
 * @param target 
 * @returns 
 */
function extractHai(haiIndex: HaiIndex, target: number[]): HaiIndex | null {
  // 下側から走査するため0以下かの判定は不要
  if (target.some(v => v > 9)) {
    return null
  }
  const haiIndexCopy = [...haiIndex];
  target.forEach(v => --haiIndexCopy[v]);
  return haiIndexCopy.some(v => v < 0) ? null : haiIndexCopy;
}

/**
 * 抜き出した面子と面子候補の数、及び対子を含むかを操作する
 * @param info 元々のinfo
 * @param isCompleteMentsu 新たに出来たのは面子か面子候補か
 * @param haveToitsu 操作で新たに対子が出来たか
 * @returns インクリメントされたinfo
 */
function incrementInfo(
  info: MentsuCountInfo,
  isCompleteMentsu: boolean,
  haveToitsu: boolean,
): MentsuCountInfo {
  return {
    mentsu: info.mentsu + Number(isCompleteMentsu),
    candidate: info.candidate + Number(!isCompleteMentsu),
    haveToitsu: info.haveToitsu || haveToitsu,
  };
}

/** Pythonのitertools.product相当 */
function iterProduct<T>(...arrays: T[][]) {
  return arrays.reduce(
    (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
    [[]] as T[][]
  );
}

/**
 * 面子と面子候補の数からシャンテン数を計算する
 * @param infoList 
 * @returns 
 */
function calculateSyantenFromCountInfo(infoList: MentsuCountInfo[][]): number {
  const syantenCandidate: number[] = [];
  for (const infoSet of iterProduct(...infoList)) {
    const infoSummary = infoSet.reduce((p, c) => {
      return {
        mentsu: p.mentsu + c.mentsu, 
        candidate: p.candidate + c.candidate,
        haveToitsu: p.haveToitsu || c.haveToitsu, 
      }
    });
    syantenCandidate.push(
      8
      - infoSummary.mentsu * 2
      + Math.min(
        infoSummary.candidate,
        4 - infoSummary.mentsu,
      )
      - Number(infoSummary.haveToitsu)
    );
  }
  return Math.min(...syantenCandidate);
}