import { Hai } from "../pages/Play/Play";

export default function sortTehai(tehai: Hai[]) {
  const kindOrder: { [key: string]: number } = {
    manzu: 1,
    pinzu: 2,
    souzu: 3,
    sufonpai: 4,
    sangenpai: 5,
  };

  return tehai.sort((a: Hai, b: Hai) => {
    if (kindOrder[a.kind] !== kindOrder[b.kind]) {
      return kindOrder[a.kind] - kindOrder[b.kind];
    } else {
      return a.value - b.value;
    }
  });
}
