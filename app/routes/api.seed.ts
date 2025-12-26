import { getDB } from "../lib/db";
import { haiyama } from "../lib/db/schema";
import type { Hai, SuhaiKind } from "../lib/hai/utils";
import { constructHai } from "../lib/hai/utils";
import type { Route } from "./+types/api.seed";

function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		if (temp !== undefined && array[j] !== undefined) {
			array[i] = array[j];
			array[j] = temp;
		}
	}
	return array;
}

function createHaiyama(): Hai[] {
	const kinds: SuhaiKind[] = ["manzu", "pinzu", "souzu"];
	let sortedHaiyama: Hai[] = [];

	for (const kind of kinds) {
		for (let value = 1; value < 10; value++) {
			sortedHaiyama = sortedHaiyama.concat(
				new Array<Hai>(4).fill(constructHai(kind, value)),
			);
		}
	}
	const minLengthOfHaiyama = 31;
	const shuffledHaiyama = shuffleArray(sortedHaiyama);
	const trimedHaiyama = shuffledHaiyama.slice(0, minLengthOfHaiyama);
	return trimedHaiyama;
}

async function seed(env: Env) {
	const db = getDB(env);

	const haiyamaData = createHaiyama();

	await db.insert(haiyama).values({ tiles: haiyamaData });

	console.log("Seeding complete");
}

export async function loader({ context }: Route.LoaderArgs) {
	const { env } = context.cloudflare;
	await seed(env);
}
