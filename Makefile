.PHONY: dev build format

watch:
	@bun vite

start:
	@bun run dev

format:
	@bunx prettier . --write
