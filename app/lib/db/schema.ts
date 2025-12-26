import { sql } from "drizzle-orm";
import {
	check,
	customType,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import type { Hai } from "../hai/utils";

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

// relation between user and haiyama
export const kyoku = sqliteTable(
	"kyoku",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		haiyamaId: text("haiyama_id")
			.notNull()
			.references(() => haiyama.id, { onDelete: "cascade" }),
		didAgari: integer("did_agari", { mode: "boolean" }).notNull(),
		agariJunme: integer("agari_junme"),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.haiyamaId] }),
		index("kyoku_user_id_idx").on(table.userId),
		index("kyoku_haiyama_id_idx").on(table.haiyamaId),
		check(
			"agari_consistency",
			sql`(${table.didAgari} = false) OR (${table.didAgari} = true AND ${table.agariJunme} IS NOT NULL)`,
		),
	],
);

// better-auth
export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" })
		.default(false)
		.notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	isAnonymous: integer("is_anonymous", { mode: "boolean" }),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", {
		mode: "timestamp",
	}),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});
