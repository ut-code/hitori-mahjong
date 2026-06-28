import { Link, redirect, useFetcher } from "react-router";
import { getDB } from "@/db";
import { getAuth } from "@/features/auth";
import { authClient } from "@/features/auth/client";
import { startNewGame } from "@/features/game";
import github from "/github.svg";
import logo from "/logo.svg";
import type { Route } from "./+types/_index";

export async function action({ context, request }: Route.ActionArgs) {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user.id) throw new Response("Unauthorized", { status: 401 });
	await startNewGame(getDB(env), session.user.id);
	return redirect("/play");
}

export default function Page() {
	const fetcher = useFetcher();
	async function handlePlay() {
		const session = await authClient.getSession();
		if (!session?.data?.user) {
			await authClient.signIn.anonymous();
		}
		fetcher.submit(null, { method: "post", action: "/?index" });
	}
	return (
		<div className="h-screen w-screen bg-[#1A472A] font-serif text-white relative flex justify-center">
			<h1 className="absolute top-1/3 text-center font-bold text-4xl tracking-widest">
				一人麻雀
			</h1>
			<div className="absolute top-1/2 flex flex-col md:flex-row items-center space-y-4 md:space-x-4 md:space-y-0">
				<button
					onClick={handlePlay}
					type="button"
					className="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 transition-transform duration-150 hover:scale-105 text-white"
				>
					プレイ
				</button>
				<Link
					to="/learn"
					className="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
				>
					チュートリアル
				</Link>
			</div>

			<div className="absolute bottom-4 text-xs text-gray-400 flex gap-4">
				<a href="https://utcode.net" target="_blank" rel="noopener noreferrer">
					<img src={logo} alt="Logo" className="w-10" />
				</a>
				<a
					href="https://github.com/ut-code/hitori-mahjong"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src={github} alt="Logo" className="w-10 invert" />
				</a>
			</div>
		</div>
	);
}
