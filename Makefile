.PHONY: dev build format

watch:
	@npm run dev

start:
	@npm run build && npx tsc && node dist/server.js

format:
	@npx prettier . --write