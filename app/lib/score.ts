export function getAgariScoreDelta(junme: number): number {
	if (junme <= 6) return 8000;
	if (junme <= 12) return 6400;
	return 5200;
}
