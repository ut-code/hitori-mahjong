import type { FetcherWithComponents } from "react-router";

type RyukyokuModalProps = {
	ryukyokuShanten: number;
	ryukyokuScoreDelta: number;
	actionFetcher: FetcherWithComponents<unknown>;
};

export function RyukyokuModal({
	ryukyokuShanten,
	ryukyokuScoreDelta,
	actionFetcher,
}: RyukyokuModalProps) {
	return (
		<dialog id="ryukyoku_modal" className="modal" open>
			<div className="modal-box bg-[#0F2918] border border-yellow-700 text-white">
				<h3 className="font-bold text-2xl text-yellow-400">流局</h3>
				<p className="mt-2">
					シャンテン: {ryukyokuShanten} / 獲得スコア: +{ryukyokuScoreDelta}
				</p>
				<div className="modal-action">
					<actionFetcher.Form method="post" action="/api/ryukyoku">
						<button
							className="btn bg-yellow-600 text-white border-none"
							type="submit"
							disabled={actionFetcher.state !== "idle"}
						>
							確認
						</button>
					</actionFetcher.Form>
				</div>
			</div>
		</dialog>
	);
}
