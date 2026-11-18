import { createFileRoute, Link } from "@tanstack/solid-router";
import { For, Match, Show, Switch } from "solid-js";
import { getScoreFn } from "@/lib/service/game/server";

export const Route = createFileRoute("/score")({
  loader: () => getScoreFn(),
  component: Page,
});

const KYOKU_NAMES = ["東1", "東2", "東3", "東4"];

function Page() {
  const data = Route.useLoaderData();

  return (
    <div class="min-h-screen bg-[#1A472A] p-8 font-serif text-white flex items-center justify-center">
      <div class="w-full max-w-4xl">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-yellow-400">成績表</h1>
          <div class="text-xl text-white">
            合計スコア: <span class="font-bold">{data().totalScore}点</span>
          </div>
        </div>

        <div class="mb-4 flex flex-col gap-2">
          <Link
            to="/"
            class="bg-yellow-600 rounded text-xs w-24 h-7 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
          >
            ホームに戻る
          </Link>
          <Link
            to="/gameover"
            class="bg-blue-600 rounded text-xs w-28 h-7 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
          >
            終局画面に戻る
          </Link>
        </div>

        <Show
          when={data().sessions.length > 0}
          fallback={
            <div class="bg-[#0F2918] rounded-lg p-8 text-center">
              <p class="text-white text-lg">まだ対局履歴がありません</p>
              <a href="/play" class="btn bg-blue-600 text-white mt-4">
                プレイする
              </a>
            </div>
          }
        >
          <div class="space-y-6">
            <For each={data().sessions}>
              {(session, si) => (
                <div class="bg-[#0F2918] rounded-lg overflow-hidden">
                  <div class="p-3 bg-[#1A472A]">
                    <h2 class="text-lg font-bold text-yellow-400">
                      第{data().sessions.length - si()}局
                    </h2>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="min-w-[40rem] w-full text-white">
                      <thead class="bg-[#143820]">
                        <tr>
                          <th class="p-3 text-left">局</th>
                          <th class="p-3 text-left">結果</th>
                          <th class="p-3 text-center">巡目</th>
                          <th class="p-3 text-center">和了確率</th>
                          <th class="p-3 text-center">シャンテン</th>
                          <th class="p-3 text-right">得点</th>
                        </tr>
                      </thead>
                      <tbody>
                        <For each={session.records}>
                          {(record, ri) => (
                            <tr class="border-t border-[#1A472A]">
                              <td class="p-3 font-bold">{KYOKU_NAMES[ri()]}</td>
                              <td class="p-3">
                                <Switch fallback={<span class="text-gray-400">流局</span>}>
                                  <Match when={record.didAgari}>
                                    <span class="text-green-400 font-bold">和了</span>
                                  </Match>
                                  <Match when={record.shanten === 0}>
                                    <span class="text-blue-400">テンパイ</span>
                                  </Match>
                                  <Match when={record.shanten === 1}>
                                    <span class="text-yellow-400">1シャンテン</span>
                                  </Match>
                                </Switch>
                              </td>
                              <td class="p-3 text-center">
                                {record.didAgari ? (record.agariJunme ?? "-") : "-"}
                              </td>
                              <td class="p-3 text-center">
                                <Show
                                  when={record.playedCount > 0}
                                  fallback={<span class="text-gray-400">-</span>}
                                >
                                  <span class="text-green-400 font-bold">
                                    {((record.agariCount / record.playedCount) * 100).toFixed(1)}%
                                  </span>
                                </Show>
                              </td>
                              <td class="p-3 text-center">{record.shanten}</td>
                              <td class="p-3 text-right">
                                <span
                                  class={
                                    record.scoreDelta > 0
                                      ? "text-green-400 font-bold"
                                      : "text-gray-400"
                                  }
                                >
                                  +{record.scoreDelta}
                                </span>
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
