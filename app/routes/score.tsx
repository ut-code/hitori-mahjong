import { desc, eq, sql } from "drizzle-orm";
import { Link } from "react-router";
import { getAuth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { kyoku } from "@/lib/db/schema";
import type { Route } from "./+types/score";

export type KyokuRecord = {
	id: string;
	haiyamaId: string;
	didAgari: boolean;
	agariJunme: number | null;
	shanten: number;
	scoreDelta: number;
	createdAt: Date;
	playedCount: number;
	agariCount: number;
};

export type GameSession = {
	records: KyokuRecord[];
};

export type ScoreData = {
	sessions: GameSession[];
	totalScore: number;
};

export async function loader({
	context,
	request,
}: Route.LoaderArgs): Promise<ScoreData> {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	const db = getDB(env);

	const records = await db
		.select({
			id: kyoku.id,
			haiyamaId: kyoku.haiyamaId,
			didAgari: kyoku.didAgari,
			agariJunme: kyoku.agariJunme,
			shanten: kyoku.shanten,
			scoreDelta: kyoku.scoreDelta,
			createdAt: kyoku.createdAt,
		})
		.from(kyoku)
		.where(eq(kyoku.userId, userId))
		.orderBy(desc(kyoku.createdAt));

	const stats = await db
		.select({
			haiyamaId: kyoku.haiyamaId,
			playedCount: sql<number>`count(*)`,
			agariCount: sql<number>`coalesce(sum(case when ${kyoku.didAgari} then 1 else 0 end), 0)`,
		})
		.from(kyoku)
		.groupBy(kyoku.haiyamaId);

	const statsByHaiyamaId = new Map(stats.map((stat) => [stat.haiyamaId, stat]));

	const recordsWithStats: KyokuRecord[] = records.map((record) => {
		const stat = statsByHaiyamaId.get(record.haiyamaId);

		return {
			...record,
			playedCount: stat?.playedCount ?? 0,
			agariCount: stat?.agariCount ?? 0,
		};
	});

	// Group records into game sessions (4 kyoku per session)
	const sessions: GameSession[] = [];
	for (let i = 0; i < recordsWithStats.length; i += 4) {
		const chunk = recordsWithStats.slice(i, i + 4).reverse(); // East-1, 2, 3, 4 order
		sessions.push({ records: chunk });
	}

	const totalScore =
		25000 + recordsWithStats.reduce((sum, r) => sum + (r.scoreDelta || 0), 0);

	return {
		sessions,
		totalScore,
	};
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const { sessions, totalScore } = loaderData;

	const kyokuNames = ["東1", "東2", "東3", "東4"];

	return (
		<div className="min-h-screen bg-[#1A472A] p-8 font-serif text-white flex items-center justify-center">
			<div className="w-full max-w-4xl">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-yellow-400">成績表</h1>
					<div className="text-xl text-white">
						合計スコア: <span className="font-bold">{totalScore}点</span>
					</div>
				</div>

				<div className="mb-4 flex flex-col gap-2">
					<Link
						to="/"
						className="bg-yellow-600 rounded text-xs w-24 h-7 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
					>
						ホームに戻る
					</Link>
					<Link
						to="/gameover"
						className="bg-blue-600 rounded text-xs w-28 h-7 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
					>
						終局画面に戻る
					</Link>
				</div>

				{sessions.length === 0 ? (
					<div className="bg-[#0F2918] rounded-lg p-8 text-center">
						<p className="text-white text-lg">まだ対局履歴がありません</p>
						<a href="/play" className="btn bg-blue-600 text-white mt-4">
							プレイする
						</a>
					</div>
				) : (
					<div className="space-y-6">
						{sessions.map((session, si) => (
							<div
								key={session.records[0]?.id ?? si}
								className="bg-[#0F2918] rounded-lg overflow-hidden"
							>
								<div className="p-3 bg-[#1A472A]">
									<h2 className="text-lg font-bold text-yellow-400">
										第{sessions.length - si}局
									</h2>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-[40rem] w-full text-white">
										<thead className="bg-[#143820]">
											<tr>
												<th className="p-3 text-left">局</th>
												<th className="p-3 text-left">結果</th>
												<th className="p-3 text-center">巡目</th>
												<th className="p-3 text-center">和了確率</th>
												<th className="p-3 text-center">シャンテン</th>
												<th className="p-3 text-right">得点</th>
											</tr>
										</thead>
										<tbody>
											{session.records.map((record, ri) => (
												<tr
													key={record.id}
													className="border-t border-[#1A472A]"
												>
													<td className="p-3 font-bold">{kyokuNames[ri]}</td>
													<td className="p-3">
														{record.didAgari ? (
															<span className="text-green-400 font-bold">
																和了
															</span>
														) : record.shanten === 0 ? (
															<span className="text-blue-400">テンパイ</span>
														) : record.shanten === 1 ? (
															<span className="text-yellow-400">
																1シャンテン
															</span>
														) : (
															<span className="text-gray-400">流局</span>
														)}
													</td>
													<td className="p-3 text-center">
														{record.didAgari ? (record.agariJunme ?? "-") : "-"}
													</td>
													<td className="p-3 text-center">
														{record.playedCount > 0 ? (
															<span className="text-green-400 font-bold">
																{(
																	(record.agariCount / record.playedCount) *
																	100
																).toFixed(1)}
																%
															</span>
														) : (
															<span className="text-gray-400">-</span>
														)}
													</td>
													<td className="p-3 text-center">{record.shanten}</td>
													<td className="p-3 text-right">
														<span
															className={
																record.scoreDelta > 0
																	? "text-green-400 font-bold"
																	: "text-gray-400"
															}
														>
															+{record.scoreDelta}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
