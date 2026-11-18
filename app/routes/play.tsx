import { createFileRoute, useNavigate, useRouter } from "@tanstack/solid-router";
import { createMemo, createSignal, Show } from "solid-js";
import { AgariModal } from "@/lib/components/play/AgariModal";
import { GameHeader } from "@/lib/components/play/GameHeader";
import { HintPanel } from "@/lib/components/play/HintPanel";
import { RyukyokuModal } from "@/lib/components/play/RyukyokuModal";
import { SutehaiDisplay } from "@/lib/components/play/SutehaiDisplay";
import { TehaiDisplay } from "@/lib/components/play/TehaiDisplay";
import judgeAgari from "@/lib/core/agari";
import { TILE_IMAGE_PATHS, TOTAL_TSUMO_PER_KYOKU } from "@/lib/core/constants";
import { applyDiscard, type Discard } from "@/lib/core/discard";
import { sortTehai } from "@/lib/core/hai";
import { buildHintDiscards, type ShantenAdvanceDiscard } from "@/lib/core/hints";
import { getAgariScoreDelta } from "@/lib/core/score";
import { calculateShanten } from "@/lib/core/shanten";
import type { GameState } from "@/lib/core/types/game";
import { discardFn, finishKyokuFn, getPlayStateFn } from "@/lib/service/game/server";

export const Route = createFileRoute("/play")({
  loader: () => getPlayStateFn(),
  head: () => ({
    links: TILE_IMAGE_PATHS.map((href) => ({
      rel: "preload",
      as: "image",
      href,
    })),
  }),
  component: Page,
});

function Page() {
  const loaderData = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();

  // ローダーの値から派生しつつ手元で書き換えられる signal。局が変わってローダーが再実行されると取り直す
  const [gameState, setGameState] = createSignal<GameState>(() => loaderData());
  const [discarding, setDiscarding] = createSignal(false);
  const [finishing, setFinishing] = createSignal(false);
  const [hint, setHint] = createSignal<{
    junme: number;
    discards: ShantenAdvanceDiscard[];
    isAdvanceHint: boolean;
  } | null>(null);

  const tehai = createMemo(() => sortTehai(gameState().tehai));
  const shantenResult = createMemo(() => calculateShanten(tehai()));
  const isAgari = createMemo(() => {
    const tsumohai = gameState().tsumohai;
    return tsumohai !== null && judgeAgari(sortTehai([...tehai(), tsumohai]));
  });
  const isRyukyoku = () => gameState().remainTsumo <= 0;
  const ryukyokuScoreDelta = () => {
    const shanten = shantenResult().shanten;
    return shanten === 0 ? 3000 : shanten === 1 ? 1000 : 0;
  };
  // 巡目が進んだら前の巡のヒントは意味がないため、巡目と紐づけて保持し一致するときだけ表示する
  const currentHint = () => {
    const h = hint();
    return h && h.junme === gameState().junme ? h : null;
  };

  async function handleDiscard(discard: Discard) {
    if (discarding()) return;
    setDiscarding(true);
    setGameState((prev) => applyDiscard(prev, discard));
    try {
      setGameState(await discardFn({ data: discard }));
    } catch {
      // 楽観的に進めた状態がサーバーとずれたままにならないよう、正しい状態を取り直す
      await router.invalidate();
    } finally {
      setDiscarding(false);
    }
  }

  async function handleFinish(intent: "agari" | "ryukyoku") {
    setFinishing(true);
    try {
      const { isGameOver } = await finishKyokuFn({ data: { intent } });
      if (isGameOver) await navigate({ to: "/gameover" });
      else await router.invalidate();
    } finally {
      setFinishing(false);
    }
  }

  function handleHintToggle() {
    if (currentHint()) {
      setHint(null);
      return;
    }
    const tsumohai = gameState().tsumohai;
    if (!tsumohai || discarding()) return;
    const result = buildHintDiscards(tehai(), tsumohai, shantenResult().shanten);
    setHint({
      junme: gameState().junme,
      discards: result.discards,
      isAdvanceHint: result.isAdvanceHint,
    });
  }

  return (
    <div class="min-h-screen bg-[#1A472A] p-3 md:p-4 font-serif text-white flex flex-col">
      <Show when={isAgari() && gameState().tsumohai}>
        {(tsumohai) => (
          <AgariModal
            tehai={tehai()}
            tsumohai={tsumohai()}
            agariScoreDelta={getAgariScoreDelta(gameState().junme)}
            pending={finishing()}
            onConfirm={() => handleFinish("agari")}
          />
        )}
      </Show>
      <Show when={!isAgari() && isRyukyoku()}>
        <RyukyokuModal
          shanten={shantenResult().shanten}
          scoreDelta={ryukyokuScoreDelta()}
          pending={finishing()}
          onConfirm={() => handleFinish("ryukyoku")}
        />
      </Show>

      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-6xl">
          <GameHeader
            kyoku={gameState().kyoku}
            junme={gameState().junme}
            score={gameState().score}
            shanten={shantenResult().shanten}
            tsumoProgressValue={Math.max(0, TOTAL_TSUMO_PER_KYOKU - gameState().remainTsumo)}
          />

          <div class="mb-3 md:flex md:items-start md:gap-3 w-full md:w-[50.25rem] mx-auto">
            <SutehaiDisplay sutehai={gameState().sutehai} />
            <HintPanel
              showHints={currentHint() !== null}
              hintDiscards={currentHint()?.discards ?? []}
              isAdvanceHint={currentHint()?.isAdvanceHint ?? true}
              isHintCalculating={discarding()}
              onToggle={handleHintToggle}
            />
          </div>

          <div class="w-full md:w-[50.25rem] mx-auto">
            <h3 class="text-sm md:text-base mb-1 text-yellow-300">手牌</h3>
            <TehaiDisplay
              tehai={tehai()}
              tsumohai={gameState().tsumohai}
              disabled={discarding()}
              onTedashi={(index) => handleDiscard({ intent: "tedashi", index })}
              onTsumogiri={() => handleDiscard({ intent: "tsumogiri" })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
