# 一人麻雀

五月祭・駒場祭用

## 技術スタック

- **フレームワーク**: TanStack Start (SSR) + Solid 2
- **スタイリング**: TailwindCSS + DaisyUI
- **デプロイ**: Cloudflare Workers
- **データベース**: Cloudflare D1 (SQLite), Drizzle ORM
- **認証**: Better-Auth (anonymous login)

## 開発

```bash
pnpm install
pnpm dev
```

## マイグレーション

### ローカル

```bash
pnpm drizzle-kit generate --name <migration_name>

pnpm drizzle-kit migrate
```

### Better-Auth

```bash
pnpx auth generate --output ./app/lib/service/db/auth-schema.ts --adapter drizzle --dialect sqlite
```

### リモート (Production)

main への push で GitHub Actions がデプロイ前に適用する。手で当てるときは以下。

```bash
pnpm wrangler d1 migrations apply hitori-mahjong-db --remote
```

## 牌山の seed

`scripts/haiyama.sql` は開発・検証用の牌山データです。D1 ではトランザクション文が使えないため、`BEGIN` / `COMMIT` は含めていません。

```bash
pnpm wrangler d1 execute hitori-mahjong-db --remote --file scripts/haiyama.sql
```
