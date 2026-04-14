ALTER TABLE `haiyama` ADD `avg_agari_junme` real DEFAULT 0 NOT NULL;

-- Backfill existing haiyama rows with their historical average agari junme
UPDATE `haiyama`
SET `avg_agari_junme` = COALESCE(
    (SELECT AVG(`agari_junme`) FROM `kyoku` WHERE `kyoku`.`haiyama_id` = `haiyama`.`id`),
    0
);