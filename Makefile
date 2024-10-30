.PHONY: dev build format

watch:
	@bun run dev

start:
	@bun run build && bun run tsc && node dist/server/server.js

format:
	@bunx prettier . --write
