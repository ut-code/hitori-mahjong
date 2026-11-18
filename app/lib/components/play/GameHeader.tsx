import { TOTAL_TSUMO_PER_KYOKU } from "@/lib/core/constants";

type GameHeaderProps = {
  kyoku: number;
  junme: number;
  score: number;
  shanten: number;
  tsumoProgressValue: number;
};

export function GameHeader(props: GameHeaderProps) {
  return (
    <div class="mb-2 md:mb-3 bg-[#0F2918] rounded-lg p-2 md:p-3 border border-[#1A472A] w-full md:w-[50.25rem] mx-auto">
      <div class="flex flex-col gap-2">
        <p class="text-lg md:text-2xl font-bold text-yellow-300 leading-tight">
          東{props.kyoku}局
          <span class="text-white text-base md:text-lg font-semibold">
            （全4局）巡目: {props.junme} / 18
          </span>
        </p>
        <div class="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base">
          <span class="bg-[#1A472A] border border-[#2E6A47] rounded px-2 py-1">
            スコア: {props.score}
          </span>
          <span class="bg-[#1A472A] border border-[#2E6A47] rounded px-2 py-1">
            シャンテン: {props.shanten === -1 ? "和了" : props.shanten}
          </span>
        </div>
      </div>
      <div class="mt-2">
        <progress
          class="progress progress-warning w-full h-2"
          value={props.tsumoProgressValue}
          max={TOTAL_TSUMO_PER_KYOKU}
        />
      </div>
    </div>
  );
}
