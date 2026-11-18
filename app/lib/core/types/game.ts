import type { Hai } from "./hai";

export type GameState = {
	kyoku: number;
	junme: number;
	remainTsumo: number;
	score: number;
	nextTsumohai: Hai | null;
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai | null;
};

export type GameStateRecord = {
	userId: string;
	kyoku: number;
	junme: number;
	remainTsumo: number;
	score: number;
	haiyama: Hai[];
	sutehai: Hai[];
	tehai: Hai[];
	tsumohai: Hai[];
	haiyamaId: string | null;
};

export type IndexedHai = Hai & { index: number };

export type GameOverData = {
	finalScore: number;
	rank: number;
	totalPlayers: number;
	gapToTop: number;
	totalKyoku: number;
	agariCount: number;
	ryukyokuCount: number;
	tenpaiCount: number;
};

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
