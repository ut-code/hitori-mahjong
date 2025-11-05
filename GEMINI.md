# Repository Structure Summary

This document provides an overview of the directory structure and key files in the `hitori-mahjong` repository.

## Overview

This project is a web application for playing a solo (hitori) version of Mahjong. It appears to be built with a modern web stack, utilizing server-side rendering with Cloudflare Workers.

## Technology Stack

- **Frontend:** React Router v7
- **Backend:** React Router v7 + Cloudflare Workers
- **Database:** Drizzle ORM (likely with a service like Cloudflare D1)
- **Authentication:** Better Auth (see `app/lib/auth.ts`)
- **Styling:** Tailwind CSS + daisyUI (`app/app.css`)
- **Package Manager:** Bun

## Top-Level Files

- `package.json`: Defines project scripts, dependencies, and metadata.
- `vite.config.ts`: Configuration for the Vite frontend build tool.
- `wrangler.jsonc`: Configuration for Cloudflare Workers deployment.
- `drizzle.config.ts`: Configuration for the Drizzle ORM.
- `tsconfig.json`: Base TypeScript configuration.
- `biome.jsonc`: Configuration for the Biome linter/formatter.
- `lefthook.yml`: Git hooks configuration.
- `docker-compose.yml`: Defines services for local development, likely for a database or Redis.

## Core Directories

### `app/`

This is the main source code for the frontend application.

- `app/root.tsx`: The root component of the React application.
- `app/entry.server.tsx`: The server-side rendering entry point.
- `app/routes/`: Contains the route components for the application, following a file-based routing convention.
  - `_index.tsx`: The home page.
  - `learn.tsx`: A tutorial or learning page.
  - `api.auth.$.ts`: API routes for handling authentication.
- `app/lib/`: Contains core application logic, utilities, and components.
  - `auth.ts` & `auth-client.ts`: Authentication logic for server and client.
  - `hai.ts`: Core logic related to Mahjong tiles (牌).
  - `redis.ts`: Redis client setup.
  - `db/`: Database schema (`schema.ts`) and client initialization (`index.ts`).
  - `components/`: Reusable React components.

### `public/`

Contains static assets that are served directly to the client.

- `hai/`: Images for all the Mahjong tiles.
- `tutorial/`: Images used in the tutorial sections.
- `background/`: Background images for the application.
- Other assets like `favicon.ico` and `logo.svg`.

### `workers/`

This directory likely contains the source code for the Cloudflare Worker that serves as the backend.

- `app.ts`: The main application logic for the worker.

### `old-workspaces/`

This directory appears to contain a previous version of the project, possibly from a monorepo structure. It is likely not in active use but is kept for reference. It is divided into `server`, `shared`, and `web` packages.

### `.github/`

Contains GitHub Actions workflows for CI/CD.

- `check.yml`: A workflow that likely runs on pull requests to perform checks like linting, testing, and building.
- `scheduled-request.yml`: A workflow that runs on a schedule.
