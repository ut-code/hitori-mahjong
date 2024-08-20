import { Hai } from "../pages/Play/Play";
function deleteKoTsu(remainingTehai: Hai[]) {
  for (let i = 0; i < remainingTehai.length - 2; i++) {
    if (
      remainingTehai[i].kind === remainingTehai[i + 1].kind &&
      remainingTehai[i].kind === remainingTehai[i + 2].kind &&
      remainingTehai[i].value === remainingTehai[i + 1].value &&
      remainingTehai[i].value === remainingTehai[i + 2].value
    ) {
      remainingTehai = remainingTehai
        .slice(0, i)
        .concat(remainingTehai.slice(i + 3));
      i -= 1; // 削除後のインデックスを調整
    }
  }
  return remainingTehai;
}

function deleteSyuntsu(remainingTehai: Hai[]) {
  for (let i = 0; i < remainingTehai.length - 2; i++) {
    if (
      remainingTehai[i].kind === remainingTehai[i + 1].kind &&
      remainingTehai[i].kind === remainingTehai[i + 2].kind &&
      remainingTehai[i].value + 1 === remainingTehai[i + 1].value &&
      remainingTehai[i].value + 2 === remainingTehai[i + 2].value
    ) {
      remainingTehai = remainingTehai
        .slice(0, i)
        .concat(remainingTehai.slice(i + 3));
      i -= 1; // 削除後のインデックスを調整
    }
  }
  return remainingTehai;
}

export default function judgeAgari(tehai: Hai[]) {
  for (let i = 0; i < tehai.length - 1; i++) {
    if (
      tehai[i].kind === tehai[i + 1].kind &&
      tehai[i].value === tehai[i + 1].value
    ) {
      // まず雀頭候補を探す
      let remainingTehai = tehai.slice(0, i).concat(tehai.slice(i + 2));
      // 刻子を消していく
      remainingTehai = deleteKoTsu(remainingTehai);
      // 順子を消していく
      remainingTehai = deleteSyuntsu(remainingTehai);
      if (remainingTehai.length === 0) {
        return true;
      }
    }
  }
  return false;
}
