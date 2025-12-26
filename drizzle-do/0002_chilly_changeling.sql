CREATE TABLE `game_state` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`kyoku` integer NOT NULL,
	`junme` integer NOT NULL,
	`haiyama` text NOT NULL,
	`sutehai` text NOT NULL,
	`tehai` text NOT NULL,
	`tsumohai` text
);
--> statement-breakpoint
DROP TABLE `users_table`;