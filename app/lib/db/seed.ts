import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";
import type { Hai, SuhaiKind } from "../hai";
import { constructHai, haiToDBHai } from "../hai";
import { hai, haiyama } from "./schema";

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
	return shuffleArray(sortedHaiyama);
}

async function main() {
	const client = new Client({
		connectionString: process.env.DATABASE_URL,
	});
	await client.connect();
	const db = drizzle(client);

	const newHaiyamaId = uuidv4();
	const haiyamaData = createHaiyama();

	await db.insert(haiyama).values({ id: newHaiyamaId });

	const haiData = haiyamaData.map((h, i) => haiToDBHai(h, newHaiyamaId, i));

	await db.insert(hai).values(haiData);

	console.log("Seeding complete");
	await client.end();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
