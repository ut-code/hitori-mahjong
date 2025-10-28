import type { Route } from "./+types/api.auth.$";
import { getAuth } from "~/lib/auth";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const auth = getAuth(env);
  return auth.handler(request);
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env } = context.cloudflare;
  const auth = getAuth(env);
  return auth.handler(request);
}
