import { createFileRoute, Link, useNavigate } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { getGameOverFn, startGameFn } from "@/lib/service/game/server";

export const Route = createFileRoute("/gameover")({
	loader: () => getGameOverFn(),
	component: Page,
});

function Page() {
	const data = Route.useLoaderData();
	const navigate = useNavigate();
	const [starting, setStarting] = createSignal(false);
	const rankMessage = () =>
		`${data().totalPlayers}人中${data().rank}位: 1位まで${data().gapToTop}点差`;

	async function handleRestart() {
		setStarting(true);
		try {
			await startGameFn();
			await navigate({ to: "/play" });
		} finally {
			setStarting(false);
		}
	}

	return (
		<div class="min-h-screen bg-[#1A472A] p-8 font-serif flex items-center justify-center">
			<div class="w-full max-w-2xl">
				<h1 class="text-3xl font-bold text-yellow-400 mb-8 text-center">
					終局
				</h1>

				<div class="bg-[#0F2918] rounded-lg p-6 mb-6">
					<div class="text-center mb-6">
						<p class="text-4xl font-bold text-white mb-2">
							最終スコア: {data().finalScore}点
						</p>
						<p class="text-sm text-yellow-300">{rankMessage()}</p>
					</div>

					<div class="grid grid-cols-2 gap-4 text-white">
						<div class="bg-[#1A472A] rounded p-4">
							<p class="text-sm text-gray-400">総局数</p>
							<p class="text-2xl font-bold">{data().totalKyoku}局</p>
						</div>
						<div class="bg-[#1A472A] rounded p-4">
							<p class="text-sm text-gray-400">和了</p>
							<p class="text-2xl font-bold text-green-400">
								{data().agariCount}回
							</p>
						</div>
						<div class="bg-[#1A472A] rounded p-4">
							<p class="text-sm text-gray-400">流局</p>
							<p class="text-2xl font-bold text-red-400">
								{data().ryukyokuCount}回
							</p>
						</div>
						<div class="bg-[#1A472A] rounded p-4">
							<p class="text-sm text-gray-400">テンパイ</p>
							<p class="text-2xl font-bold text-blue-400">
								{data().tenpaiCount}回
							</p>
						</div>
					</div>
				</div>

				<div class="flex justify-center gap-4">
					<Link to="/score" class="btn bg-yellow-600 text-white">
						成績詳細
					</Link>
					<button
						type="button"
						class="btn bg-blue-600 text-white"
						disabled={starting()}
						onClick={handleRestart}
					>
						もう一局
					</button>
				</div>
			</div>
		</div>
	);
}
