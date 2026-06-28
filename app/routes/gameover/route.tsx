import { Form, Link, redirect } from "react-router";
import { getDB } from "@/db";
import { getAuth } from "@/features/auth";
import {
	type GameOverData,
	getGameOverData,
	startNewGame,
} from "@/features/game";
import type { Route } from "../+types/gameover/_index";

export async function loader({
	context,
	request,
}: Route.LoaderArgs): Promise<GameOverData> {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) throw new Response("Unauthorized", { status: 401 });
	return getGameOverData(getDB(env), session.user.id);
}

export async function action({ context, request }: Route.ActionArgs) {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) throw new Response("Unauthorized", { status: 401 });
	await startNewGame(getDB(env), session.user.id);
	return redirect("/play");
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const {
		finalScore,
		totalKyoku,
		agariCount,
		ryukyokuCount,
		tenpaiCount,
		rank,
		totalPlayers,
		gapToTop,
	} = loaderData;
	const rankMessage = `${totalPlayers}人中${rank}位: 1位まで${gapToTop}点差`;

	return (
		<div className="min-h-screen bg-[#1A472A] p-8 font-serif flex items-center justify-center">
			<div className="w-full max-w-2xl">
				<h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
					終局
				</h1>

				<div className="bg-[#0F2918] rounded-lg p-6 mb-6">
					<div className="text-center mb-6">
						<p className="text-4xl font-bold text-white mb-2">
							最終スコア: {finalScore}点
						</p>
						<p className="text-sm text-yellow-300">{rankMessage}</p>
					</div>

					<div className="grid grid-cols-2 gap-4 text-white">
						<div className="bg-[#1A472A] rounded p-4">
							<p className="text-sm text-gray-400">総局数</p>
							<p className="text-2xl font-bold">{totalKyoku}局</p>
						</div>
						<div className="bg-[#1A472A] rounded p-4">
							<p className="text-sm text-gray-400">和了</p>
							<p className="text-2xl font-bold text-green-400">
								{agariCount}回
							</p>
						</div>
						<div className="bg-[#1A472A] rounded p-4">
							<p className="text-sm text-gray-400">流局</p>
							<p className="text-2xl font-bold text-red-400">
								{ryukyokuCount}回
							</p>
						</div>
						<div className="bg-[#1A472A] rounded p-4">
							<p className="text-sm text-gray-400">テンパイ</p>
							<p className="text-2xl font-bold text-blue-400">
								{tenpaiCount}回
							</p>
						</div>
					</div>
				</div>

				<div className="flex justify-center gap-4">
					<Link to="/score" className="btn bg-yellow-600 text-white">
						成績詳細
					</Link>
					<Form method="post">
						<button type="submit" className="btn bg-blue-600 text-white">
							もう一局
						</button>
					</Form>
				</div>
			</div>
		</div>
	);
}
