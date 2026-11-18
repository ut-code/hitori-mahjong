import { For, Match, Show, Switch } from "solid-js";
import type { ShantenAdvanceDiscard } from "@/lib/core/hints";
import { shantenLabel } from "@/lib/core/shanten";
import { HaiImage } from "./HaiImage";

type HintPanelProps = {
	showHints: boolean;
	hintDiscards: ShantenAdvanceDiscard[];
	isAdvanceHint: boolean;
	isHintCalculating: boolean;
	onToggle: () => void;
};

export function HintPanel(props: HintPanelProps) {
	const hasAnyHints = () => props.hintDiscards.length > 0;
	const status = () => {
		if (!props.showHints) return null;
		if (props.isHintCalculating) return "計算中...";
		if (!hasAnyHints()) return "なし";
		return null;
	};

	return (
		<div class="mt-2 md:mt-0 w-full md:w-[33.5rem] md:flex-none text-sm md:text-base">
			<div class="flex flex-wrap items-center gap-2 mb-1">
				<button
					type="button"
					onClick={() => props.onToggle()}
					class="btn btn-xs bg-yellow-600 text-white border-none h-6 min-h-0 px-3"
					disabled={props.isHintCalculating}
				>
					{props.showHints ? "ヒントを隠す" : "ヒントを表示"}
				</button>
				<Show
					when={props.showHints && !props.isHintCalculating && hasAnyHints()}
				>
					<span class="text-sm md:text-base text-yellow-300">
						{shantenLabel(props.hintDiscards[0].resultingShanten)}
						{props.isAdvanceHint ? "に進む打牌" : "を維持する打牌"}
					</span>
				</Show>
			</div>
			<Show when={status()}>
				{(text) => (
					<p class="text-sm md:text-base mb-1 text-yellow-300">{text()}</p>
				)}
			</Show>
			<div class="bg-[#0F2918] rounded-lg p-1 border border-[#1A472A] w-full h-[3.875rem] md:h-auto md:min-h-44">
				<div class="h-full min-w-0 overflow-x-auto overflow-y-hidden flex items-center gap-0">
					<Switch>
						<Match when={status()}>
							{(text) => (
								<p class="text-sm md:text-base text-yellow-300">{text()}</p>
							)}
						</Match>
						<Match when={props.showHints}>
							<div class="flex gap-0 shrink-0">
								<For each={props.hintDiscards}>
									{(discard) => <HaiImage hai={discard.hai} />}
								</For>
							</div>
						</Match>
					</Switch>
				</div>
			</div>
		</div>
	);
}
