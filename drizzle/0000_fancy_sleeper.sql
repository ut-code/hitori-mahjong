CREATE TABLE `game_state` (
	`user_id` text PRIMARY KEY NOT NULL,
	`kyoku` integer DEFAULT 1 NOT NULL,
	`junme` integer DEFAULT 1 NOT NULL,
	`remain_tsumo` integer DEFAULT 18 NOT NULL,
	`score` integer DEFAULT 25000 NOT NULL,
	`haiyama` text NOT NULL,
	`sutehai` text NOT NULL,
	`tehai` text NOT NULL,
	`tsumohai` text NOT NULL,
	`haiyama_id` text
);
--> statement-breakpoint
CREATE TABLE `haiyama` (
	`id` text PRIMARY KEY NOT NULL,
	`tiles` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `kyoku` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`haiyama_id` text NOT NULL,
	`did_agari` integer NOT NULL,
	`agari_junme` integer,
	`shanten` integer DEFAULT 0 NOT NULL,
	`score_delta` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`haiyama_id`) REFERENCES `haiyama`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "agari_consistency" CHECK(("kyoku"."did_agari" = false) OR ("kyoku"."did_agari" = true AND "kyoku"."agari_junme" IS NOT NULL))
);
--> statement-breakpoint
CREATE INDEX `kyoku_user_id_idx` ON `kyoku` (`user_id`);--> statement-breakpoint
CREATE INDEX `kyoku_haiyama_id_idx` ON `kyoku` (`haiyama_id`);--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`is_anonymous` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);