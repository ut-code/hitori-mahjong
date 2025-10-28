import { Link } from "react-router";
import type { Route } from "./+types/_index";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";

export async function loader({ context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const db =
    env.NODE_ENV === "development"
      ? drizzlePg(env.DATABASE_URL)
      : drizzleNeon(env.DATABASE_URL);
}

export default function Page() {
  return (
    <>
      <h1 className="text-5xl text-center pb-1">Hitori Mahjong</h1>
      <Link to="/start">
        <p className="text-center link">Get Started</p>
      </Link>

      <Link to="/learn">
        <p className="text-center link">Learn How to Play</p>
      </Link>
    </>
  );
}
