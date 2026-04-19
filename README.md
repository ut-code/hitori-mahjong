# 一人麻雀

五月祭・駒場祭用

## Tech Stack

- **Frontend**: React Router v7 (SSR), TailwindCSS + DaisyUI
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite), Drizzle ORM
- **Auth**: Better-Auth (anonymous login)

## Getting Started

```bash
npm install
npm run dev
```

## Database Migrations

### Local Development

```bash
# Generate migration from schema changes
npx drizzle-kit generate --name <migration_name>

# Apply migration to local D1
npx drizzle-kit migrate
```

### Better-Auth Schema Generation

```bash
# Generate auth schema to match DB schema location
npx auth generate --output ./app/lib/db/auth-schema.ts --adapter drizzle --dialect sqlite
```

### Remote (Production)

```bash
# Apply migration to remote D1
npx wrangler d1 migrations apply hitori-mahjong-db --remote
```

This reads the generated SQL files from `drizzle/` and applies them to the remote D1 database.

## Available Scripts

- `npm run dev` - Start development server and **generate local D1 instance**
- `npm run build` - Build for production
- `npm run deploy` - Build and deploy to Cloudflare (If you push the changes to the main branch, it will trigger a new deploy)
- `npm run typecheck` - Type checking
- `npm run format` - Format code with Biome
