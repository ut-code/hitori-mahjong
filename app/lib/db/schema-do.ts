import { customType, int, sqliteTable } from "drizzle-orm/sqlite-core";
import type { Hai } from "../hai/utils";
import { haiArray } from "./schema";

export const hai = customType<{ data: Hai; driverData: string }>({
	dataType() {
		return "text";
	},
	toDriver(value: Hai) {
		return JSON.stringify(value);
	},
	fromDriver(value: string) {
		return JSON.parse(value) as Hai;
	},
});

export const gameState = sqliteTable("game_state", {
	// 1行しか使わないので、IDを固定
	id: int("id").primaryKey().default(1),
	kyoku: int("kyoku").notNull(),
	junme: int("junme").notNull(),
	haiyama: haiArray("haiyama").notNull(),
	sutehai: haiArray("sutehai").notNull(),
	tehai: haiArray("tehai").notNull(),
	tsumohai: hai("tsumohai"),
});
