import { sql } from "drizzle-orm";
import {
	check,
	customType,
	index,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import type { Hai } from "../hai/types";
import { user } from "./auth-schema";

export * from "./auth-schema";

export const haiArray = customType<{ data: Hai[]; driverData: string }>({
	dataType() {
		return "text";
	},
	toDriver(value: Hai[]) {
		return JSON.stringify(value);
	},
	fromDriver(value: string) {
		return JSON.parse(value) as Hai[];
	},
});

export const haiyama = sqliteTable("haiyama", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	// D1だと1クエリあたり100パラメータまでなので、あえて正規化していない
	tiles: haiArray("tiles").notNull(),
});

// Game state (active game per user)
export const gameState = sqliteTable("game_state", {
	userId: text("user_id").primaryKey(),
	kyoku: integer("kyoku").notNull().default(1),
	junme: integer("junme").notNull().default(1),
	remainTsumo: integer("remain_tsumo").notNull().default(18),
	score: integer("score").notNull().default(25000),
	haiyama: haiArray("haiyama").notNull(),
	sutehai: haiArray("sutehai").notNull(),
	tehai: haiArray("tehai").notNull(),
	tsumohai: haiArray("tsumohai").notNull(), // 0 or 1 element
	haiyamaId: text("haiyama_id"),
});

// relation between user and haiyama (game history)
export const kyoku = sqliteTable(
	"kyoku",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		haiyamaId: text("haiyama_id")
			.notNull()
			.references(() => haiyama.id, { onDelete: "cascade" }),
		didAgari: integer("did_agari", { mode: "boolean" }).notNull(),
		agariJunme: integer("agari_junme"),
		shanten: integer("shanten").notNull().default(0),
		scoreDelta: integer("score_delta").notNull().default(0),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => [
		index("kyoku_user_id_idx").on(table.userId),
		index("kyoku_haiyama_id_idx").on(table.haiyamaId),
		check(
			"agari_consistency",
			sql`(${table.didAgari} = false) OR (${table.didAgari} = true AND ${table.agariJunme} IS NOT NULL)`,
		),
	],
);
