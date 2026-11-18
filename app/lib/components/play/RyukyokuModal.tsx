type RyukyokuModalProps = {
  shanten: number;
  scoreDelta: number;
  pending: boolean;
  onConfirm: () => void;
};

export function RyukyokuModal(props: RyukyokuModalProps) {
  return (
    <dialog id="ryukyoku_modal" class="modal" open>
      <div class="modal-box bg-[#0F2918] border border-yellow-700 text-white">
        <h3 class="font-bold text-2xl text-yellow-400">流局</h3>
        <p class="mt-2">
          シャンテン: {props.shanten} / 獲得スコア: +{props.scoreDelta}
        </p>
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
