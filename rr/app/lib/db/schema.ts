import { sql } from "drizzle-orm";
import {
	boolean,
	check,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const haiyama = pgTable("haiyama", {
	id: text("id").primaryKey(),
});

export const haiKindEnum = pgEnum("hai_kind", [
	"manzu",
	"pinzu",
	"souzu",
	"jihai",
]);

export const hai = pgTable("hai", {
	id: serial("id").primaryKey(),
	haiyamaId: text("haiyama_id")
		.notNull()
		.references(() => haiyama.id, { onDelete: "cascade" }),
	kind: haiKindEnum("kind").notNull(), // "manzu" | "pinzu" | "souzu" | "jihai"
	value: text("value").notNull(), // 1~9 or "ton" ~ "tyun"
	order: integer("order").notNull(), // 0~17
	index: integer("index").notNull(), // haiToIndex
});

// relation between user and haiyama
// TODO: index
export const kyoku = pgTable(
	"kyoku",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		haiyamaId: text("haiyama_id")
			.notNull()
			.references(() => haiyama.id, { onDelete: "cascade" }),
		didAgari: boolean("did_agari").notNull(),
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
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	isAnonymous: boolean("is_anonymous"),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});
