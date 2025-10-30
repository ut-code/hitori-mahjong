import { persist } from "zustand/middleware";
import type { Hai } from "./hai";
import { create } from "zustand";

interface GameState {
  kyoku: number;
  junme: number;
  haiyama: Hai[];
  sutehai: Hai[];
  tehai: Hai[];
}

const useGameState = create<GameState>()(
  persist(
    (set) => ({
      kyoku: 1,
      junme: 1,
      haiyama: [],
      sutehai: [],
      tehai: [],
    }),
    {
      name: "game-state-storage",
    },
  ),
);
