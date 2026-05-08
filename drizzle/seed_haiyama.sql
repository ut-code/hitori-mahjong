BEGIN;

WITH RECURSIVE
	nums(n) AS (
		VALUES (1)
		UNION ALL
		SELECT n + 1 FROM nums WHERE n < 40
	),
	digits(value) AS (
		VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9)
	),
	copies(copy_no) AS (
		VALUES (1), (2), (3), (4)
	),
	tiles(kind, value) AS (
		SELECT 'manzu', value FROM digits CROSS JOIN copies
		UNION ALL
		SELECT 'pinzu', value FROM digits CROSS JOIN copies
		UNION ALL
		SELECT 'souzu', value FROM digits CROSS JOIN copies
	),
	shuffled AS (
		SELECT
			n,
			kind,
			value,
			ROW_NUMBER() OVER (PARTITION BY n ORDER BY RANDOM()) AS rn
		FROM nums
		CROSS JOIN tiles
	),
	picked AS (
		SELECT
			n,
			printf(
				'[%s]',
				group_concat(
					'{"kind":"' || kind || '","value":' || value || '}',
					','
				)
			) AS tiles_json
		FROM (
			SELECT n, kind, value, rn
			FROM shuffled
			WHERE rn <= 32
			ORDER BY n, rn
		)
		GROUP BY n
	)
INSERT INTO haiyama (id, tiles)
SELECT lower(hex(randomblob(16))), tiles_json
FROM picked;

COMMIT;
