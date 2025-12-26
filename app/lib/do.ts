import type { Hai } from "./hai/utils";

export interface GameState {
	kyoku: number;
	junme: number;
	haiyama: Hai[];
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai | null;
}

export default function getDOStub(env: Env, userId: string) {
	const id = env.DO.idFromName(userId);
	const stub = env.DO.get(id);
	return stub;
}
