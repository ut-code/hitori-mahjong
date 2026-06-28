import type { ShantenAdvanceDiscard } from "./useHints";
import { getHaiKey, shantenLabel } from "./utils";

type HintPanelProps = {
	showHints: boolean;
	hintDiscards: ShantenAdvanceDiscard[];
	isAdvanceHint: boolean;
	hasAnyHints: boolean;
	isHintCalculating: boolean;
	handleHintToggle: () => void;
};

export function HintPanel({
	showHints,
	hintDiscards,
	isAdvanceHint,
	hasAnyHints,
	isHintCalculating,
	handleHintToggle,
}: HintPanelProps) {
	return (
		<div className="mt-2 md:mt-0 w-full md:w-[33.5rem] md:flex-none text-sm md:text-base">
			<div className="flex flex-wrap items-center gap-2 mb-1">
				<button
					type="button"
					onClick={handleHintToggle}
					className="btn btn-xs bg-yellow-600 text-white border-none h-6 min-h-0 px-3"
					disabled={isHintCalculating}
				>
					{showHints ? "ヒントを隠す" : "ヒントを表示"}
				</button>
				{showHints && !isHintCalculating && hasAnyHints && (
					<span className="text-sm md:text-base text-yellow-300">
						{isAdvanceHint
							? `${shantenLabel(hintDiscards[0].resultingShanten)}に進む打牌`
							: `${shantenLabel(hintDiscards[0].resultingShanten)}を維持する打牌`}
					</span>
				)}
			</div>
			{showHints && isHintCalculating ? (
				<p className="text-sm md:text-base mb-1 text-yellow-300">計算中...</p>
			) : showHints && !hasAnyHints ? (
				<p className="text-sm md:text-base mb-1 text-yellow-300">なし</p>
			) : null}
			<div className="bg-[#0F2918] rounded-lg p-1 border border-[#1A472A] w-full h-[3.875rem] md:h-auto md:min-h-44">
				<div className="h-full min-w-0 overflow-x-auto overflow-y-hidden flex items-center gap-0">
					{showHints && isHintCalculating ? (
						<p className="text-sm md:text-base text-yellow-300">計算中...</p>
					) : showHints && !hasAnyHints ? (
						<p className="text-sm md:text-base text-yellow-300">なし</p>
					) : showHints ? (
						<div className="flex gap-0 shrink-0">
							{hintDiscards.map((discard) => (
								<img
									key={getHaiKey(discard.hai)}
									src={`/hai/${discard.hai.kind}_${discard.hai.value}.png`}
									alt={`${discard.hai.kind} ${discard.hai.value}`}
									className="w-8 h-11 md:w-10 md:h-14"
								/>
							))}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
