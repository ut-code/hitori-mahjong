import { desc, eq } from "drizzle-orm";
import { useNavigate } from "react-router";
import { getAuth } from "~/lib/auth";
import { authClient } from "~/lib/auth-client";
import { getDB } from "~/lib/db";
import { kyoku } from "~/lib/db/schema";
import type { Route } from "./+types/gameover";

export interface GameOverData {
	finalScore: number;
	totalKyoku: number;
	agariCount: number;
	ryukyokuCount: number;
	tenpaiCount: number;
}

export async function loader({
	context,
	request,
}: Route.LoaderArgs): Promise<GameOverData> {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	const db = getDB(env);

	// Get all kyoku records for this user
	const allKyoku = await db
		.select()
		.from(kyoku)
		.where(eq(kyoku.userId, userId))
		.orderBy(desc(kyoku.createdAt));

	const totalKyoku = allKyoku.length;
	const agariCount = allKyoku.filter((k) => k.didAgari).length;
	const ryukyokuCount = totalKyoku - agariCount;
	const tenpaiCount = allKyoku.filter(
		(k) => !k.didAgari && k.shanten === 0,
	).length;

	// Calculate final score (sum of all score deltas + initial 25000)
	const totalScoreDelta = allKyoku.reduce(
		(sum, k) => sum + (k.scoreDelta || 0),
		0,
	);
	const finalScore = 25000 + totalScoreDelta;

	return {
		finalScore,
		totalKyoku,
		agariCount,
		ryukyokuCount,
		tenpaiCount,
	};
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const { finalScore, totalKyoku, agariCount, ryukyokuCount, tenpaiCount } =
		loaderData;
	const navigate = useNavigate();
	const scoreComment =
		finalScore === 57000
			? "もうあなたが麻雀です"
			: finalScore >= 40000
				? "素晴らしい"
				: finalScore >= 35000
					? "まずまず"
					: "まずは基本から";

	const anonymousLoginAndStart = async () => {
		const user = await authClient.getSession();
		if (user.data) {
			await authClient.signOut();
		}
		await authClient.signIn.anonymous();
		navigate("/play");
	};

	return (
		<div className="min-h-screen bg-[#1A472A] p-8 font-serif">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
					終局
				</h1>

				<div className="bg-[#0F2918] rounded-lg p-6 mb-6">
					<div className="text-center mb-6">
						<p className="text-4xl font-bold text-white mb-2">
							最終スコア: {finalScore}点
						</p>
						<p className="text-sm text-yellow-300">{scoreComment}</p>
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
					<a href="/score" className="btn bg-yellow-600 text-white">
						成績詳細
					</a>
					<button
						type="button"
						onClick={anonymousLoginAndStart}
						className="btn bg-blue-600 text-white"
					>
						もう一局
					</button>
				</div>
			</div>
		</div>
	);
}
