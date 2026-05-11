import { TOTAL_TSUMO_PER_KYOKU } from "./constants";

type GameHeaderProps = {
	kyoku: number;
	optimisticJunme: number;
	score: number;
	shantenResult: { shanten: number };
	tsumoProgressValue: number;
};

export function GameHeader({
	kyoku,
	optimisticJunme,
	score,
	shantenResult,
	tsumoProgressValue,
}: GameHeaderProps) {
	return (
		<div className="mb-2 md:mb-3 bg-[#0F2918] rounded-lg p-2 md:p-3 border border-[#1A472A] w-full md:w-[50.25rem] mx-auto">
			<div className="flex flex-col gap-2">
				<p className="text-lg md:text-2xl font-bold text-yellow-300 leading-tight">
					東{kyoku}局
					<span className="text-white text-base md:text-lg font-semibold">
						（全4局）巡目: {optimisticJunme} / 18
					</span>
				</p>
				<div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base">
					<span className="bg-[#1A472A] border border-[#2E6A47] rounded px-2 py-1">
						スコア: {score}
					</span>
					<span className="bg-[#1A472A] border border-[#2E6A47] rounded px-2 py-1">
						シャンテン:{" "}
						{shantenResult.shanten === -1 ? "和了" : shantenResult.shanten}
					</span>
				</div>
			</div>
			<div className="mt-2">
				<progress
					className="progress progress-warning w-full h-2"
					value={tsumoProgressValue}
					max={TOTAL_TSUMO_PER_KYOKU}
				/>
			</div>
		</div>
	);
}
