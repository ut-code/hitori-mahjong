.PHONY: dev build format

dev:
	@bun run dev

start:
	@bun run build && bun run server/server.ts

format:
	@bunx prettier . --write
