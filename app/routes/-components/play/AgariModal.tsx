import { For, Show } from "solid-js";
import { getAgariDetail } from "@/lib/core/agari-detail";
import type { Hai } from "@/lib/core/types/hai";
import { HaiImage } from "./HaiImage";

type AgariModalProps = {
	tehai: Hai[];
	tsumohai: Hai;
	agariScoreDelta: number;
	pending: boolean;
	onConfirm: () => void;
};

function HaiGroup(props: { hais: Hai[] }) {
	return (
		<div class="flex gap-0">
			<For each={props.hais}>{(hai) => <HaiImage hai={hai} />}</For>
		</div>
	);
}

export function AgariModal(props: AgariModalProps) {
	const agariDetail = () => getAgariDetail([...props.tehai, props.tsumohai]);
	const standard = () => {
		const d = agariDetail();
		return d?.type === "standard" ? d : null;
	};
	const chiitoitsu = () => {
		const d = agariDetail();
		return d?.type === "chiitoitsu" ? d : null;
	};

	return (
		<dialog id="agari_modal" class="modal" open>
			<div class="modal-box bg-[#0F2918] border border-yellow-700 text-white">
				<h3 class="font-bold text-2xl text-yellow-400">和了</h3>
				<p class="mt-2">獲得スコア: +{props.agariScoreDelta}</p>
				<div class="mt-2">
					<p class="text-sm mb-1">ツモ牌</p>
					<HaiImage hai={props.tsumohai} />
				</div>
				<Show when={standard()}>
					{(detail) => (
						<div class="mt-2">
							<p class="text-sm mb-1">雀頭</p>
							<div class="mb-2">
								<HaiGroup hais={detail().janto} />
							</div>
							<p class="text-sm mb-1">面子</p>
							<div class="grid grid-cols-1 md:grid-cols-[max-content_max-content] md:justify-start gap-y-1 md:gap-x-10">
								<For each={detail().mentsu}>
									{(mentsu) => <HaiGroup hais={mentsu} />}
								</For>
							</div>
						</div>
					)}
				</Show>
				<Show when={chiitoitsu()}>
					{(detail) => (
						<div class="mt-2">
							<p class="text-sm mb-1">七対子</p>
							<div class="grid grid-cols-4 gap-1">
								<For each={detail().pairs}>
									{(pair) => <HaiGroup hais={pair} />}
								</For>
							</div>
						</div>
					)}
				</Show>
				<div class="modal-action">
					<button
						class="btn bg-yellow-600 text-white border-none"
						type="button"
						disabled={props.pending}
						onClick={() => props.onConfirm()}
					>
						確認
					</button>
				</div>
			</div>
		</dialog>
	);
}
