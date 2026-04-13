import { desc, eq } from "drizzle-orm";
import { Link } from "react-router";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { kyoku } from "~/lib/db/schema";
import type { Route } from "./+types/score";

export interface KyokuRecord {
	id: string;
	didAgari: boolean;
	agariJunme: number | null;
	shanten: number;
	scoreDelta: number;
	createdAt: Date;
}

export interface ScoreData {
	records: KyokuRecord[];
	totalScore: number;
}

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
			didAgari: kyoku.didAgari,
			agariJunme: kyoku.agariJunme,
			shanten: kyoku.shanten,
			scoreDelta: kyoku.scoreDelta,
			createdAt: kyoku.createdAt,
		})
		.from(kyoku)
		.where(eq(kyoku.userId, userId))
		.orderBy(desc(kyoku.createdAt));

	const totalScore =
		25000 + records.reduce((sum, r) => sum + (r.scoreDelta || 0), 0);

	return {
		records,
		totalScore,
	};
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const { records, totalScore } = loaderData;

	return (
		<div className="min-h-screen bg-[#1A472A] p-8 font-serif">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-yellow-400">成績表</h1>
					<div className="text-xl text-white">
						合計スコア: <span className="font-bold">{totalScore}点</span>
					</div>
				</div>

				<Link
					to="/"
					className="mb-4 bg-yellow-600 rounded text-xs w-24 h-7 flex items-center justify-center transition-transform duration-150 hover:scale-105"
				>
					ホームに戻る
				</Link>

				{records.length === 0 ? (
					<div className="bg-[#0F2918] rounded-lg p-8 text-center">
						<p className="text-white text-lg">まだ対局履歴がありません</p>
						<a href="/play" className="btn bg-blue-600 text-white mt-4">
							プレイする
						</a>
					</div>
				) : (
					<div className="bg-[#0F2918] rounded-lg overflow-hidden">
						<table className="w-full text-white">
							<thead className="bg-[#1A472A]">
								<tr>
									<th className="p-3 text-left">日時</th>
									<th className="p-3 text-left">結果</th>
									<th className="p-3 text-center">巡目</th>
									<th className="p-3 text-center">シャンテン</th>
									<th className="p-3 text-right">得点</th>
								</tr>
							</thead>
							<tbody>
								{records.map((record) => (
									<tr key={record.id} className="border-t border-[#1A472A]">
										<td className="p-3">
											{new Date(record.createdAt).toLocaleString("ja-JP")}
										</td>
										<td className="p-3">
											{record.didAgari ? (
												<span className="text-green-400 font-bold">和了</span>
											) : record.shanten === 0 ? (
												<span className="text-blue-400">テンパイ</span>
											) : record.shanten === 1 ? (
												<span className="text-yellow-400">1シャンテン</span>
											) : (
												<span className="text-gray-400">流局</span>
											)}
										</td>
										<td className="p-3 text-center">
											{record.didAgari ? (record.agariJunme ?? "-") : "-"}
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
				)}
			</div>
		</div>
	);
}
