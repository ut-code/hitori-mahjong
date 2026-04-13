# Hitori Mahjong (一人麻雀)

Solo mahjong puzzle game. Draw and discard tiles to complete a winning hand.

## Tech Stack

- **Frontend**: React Router v7 (SSR), TailwindCSS + DaisyUI
- **Backend**: Cloudflare Workers, Hono + Zod
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
npx wrangler d1 migrations apply db --remote
```

This reads the generated SQL files from `drizzle/` and applies them to the remote D1 database.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Build and deploy to Cloudflare
- `npm run typecheck` - Type checking
- `npm run format` - Format code with Biome
