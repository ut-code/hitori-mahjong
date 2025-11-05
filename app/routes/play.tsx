import { sql } from "drizzle-orm";
import { getAuth } from "~/lib/auth";
import { getDB } from "~/lib/db";
import { hai, haiyama } from "~/lib/db/schema";
import { dbHaiToHai } from "~/lib/hai";
import type { Route } from "./+types/play";

export async function loader({ context, request }: Route.LoaderArgs) {
	const { env } = context.cloudflare;
	const db = getDB(env);
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) {
		throw new Response("Unauthorized", { status: 401 });
	}
	const userId = session.user.id;

	const randomHaiyama = await db
		.select()
		.from(haiyama)
		.orderBy(sql`RANDOM()`)
		.limit(1);

	if (randomHaiyama.length === 0) {
		throw new Response("No haiyama found", { status: 404 });
	}
	const selectedHaiyama = randomHaiyama[0];
	const rawHaiData = await db
		.select()
		.from(hai)
		.where(sql`${hai.haiyamaId} = ${selectedHaiyama.id}`)
		.orderBy(hai.order);
	const haiData = rawHaiData.map((hai) => dbHaiToHai(hai));
	//TODO: store data in redis
	return haiData;
}

export default function Page({ loaderData }: Route.ComponentProps) {
	console.log(loaderData);
	return (
		<>
			<p>Play Page</p>
		</>
	);
}
