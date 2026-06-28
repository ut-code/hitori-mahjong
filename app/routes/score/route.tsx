import { Link } from "react-router";
import { getDB } from "@/db";
import { getAuth } from "@/features/auth";
import { getScoreData, type ScoreData } from "@/features/game";
import type { Route } from "../+types/score/_index";

export async function loader({
	context,
	request,
}: Route.LoaderArgs): Promise<ScoreData> {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) throw new Response("Unauthorized", { status: 401 });
	return getScoreData(getDB(env), session.user.id);
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
