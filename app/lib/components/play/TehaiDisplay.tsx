import { For, Show } from "solid-js";
import type { Hai } from "@/lib/core/types/hai";
import { HaiImage } from "./HaiImage";

type TehaiDisplayProps = {
	tehai: Hai[];
	tsumohai: Hai | null;
	disabled: boolean;
	onTedashi: (index: number) => void;
	onTsumogiri: () => void;
};

function HaiButton(props: {
	hai: Hai;
	label: string;
	disabled: boolean;
	class: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			aria-label={`${props.label} ${props.hai.kind} ${props.hai.value}`}
			disabled={props.disabled}
			onClick={() => props.onClick()}
		>
			<HaiImage
				hai={props.hai}
				class={`cursor-pointer hover:scale-105 transition-transform ${props.class}`}
			/>
		</button>
	);
}

export function TehaiDisplay(props: TehaiDisplayProps) {
	const tehaiButtons = (from: number, to?: number) => (
		<For each={props.tehai.slice(from, to)}>
			{(hai, i) => (
				<HaiButton
					hai={hai}
					label="捨てる"
					disabled={props.disabled}
					class="w-8 h-11 md:w-10 md:h-14"
					onClick={() => props.onTedashi(from + i())}
				/>
			)}
		</For>
	);
	const tsumoButton = (size: string) => (
		<Show when={props.tsumohai}>
			{(tsumohai) => (
				<HaiButton
					hai={tsumohai()}
					label="ツモ切り"
					disabled={props.disabled}
					class={`object-contain ${size}`}
					onClick={() => props.onTsumogiri()}
				/>
			)}
		</Show>
	);

	return (
		<>
			{/* デスクトップ */}
			<div class="hidden md:flex items-end gap-0 bg-[#0F2918] rounded-md p-2 border border-[#1A472A] w-fit">
				{tehaiButtons(0)}
				<div class="ml-1">{tsumoButton("w-10 h-14")}</div>
			</div>

			{/* モバイル */}
			<div class="md:hidden bg-[#0F2918] rounded-md p-2 border border-[#1A472A] w-fit">
				<div class="grid grid-cols-7 gap-0">{tehaiButtons(0, 7)}</div>
				<div class="grid grid-cols-7 gap-0 mt-1">
					{tehaiButtons(7)}
					{tsumoButton("w-8 h-11")}
				</div>
			</div>
		</>
	);
}
