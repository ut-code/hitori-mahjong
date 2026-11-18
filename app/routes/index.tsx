import { createFileRoute, Link, useNavigate } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { authClient } from "@/lib/service/auth-client";
import { startGameFn } from "@/lib/service/game/server";

export const Route = createFileRoute("/")({
	component: Page,
});

function Page() {
	const navigate = useNavigate();
	const [starting, setStarting] = createSignal(false);

	async function handlePlay() {
		if (starting()) return;
		setStarting(true);
		try {
			const session = await authClient.getSession();
			if (!session?.data?.user) {
				await authClient.signIn.anonymous();
			}
			await startGameFn();
			await navigate({ to: "/play" });
		} finally {
			setStarting(false);
		}
	}

	return (
		<div class="h-screen w-screen bg-[#1A472A] font-serif text-white relative flex justify-center">
			<h1 class="absolute top-1/3 text-center font-bold text-4xl tracking-widest">
				一人麻雀
			</h1>
			<div class="absolute top-1/2 flex flex-col md:flex-row items-center space-y-4 md:space-x-4 md:space-y-0">
				<button
					onClick={handlePlay}
					type="button"
					disabled={starting()}
					class="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 transition-transform duration-150 hover:scale-105 text-white"
				>
					プレイ
				</button>
				<Link
					to="/learn"
					class="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
				>
					チュートリアル
				</Link>
			</div>

			<div class="absolute bottom-4 text-xs text-gray-400 flex gap-4">
				<a href="https://utcode.net" target="_blank" rel="noopener noreferrer">
					<img src="/logo.svg" alt="Logo" class="w-10" />
				</a>
				<a
					href="https://github.com/ut-code/hitori-mahjong"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src="/github.svg" alt="Logo" class="w-10 invert" />
				</a>
			</div>
		</div>
	);
}
