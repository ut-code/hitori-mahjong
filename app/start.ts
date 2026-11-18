import { createCsrfMiddleware, createStart } from "@tanstack/solid-start";

const PUBLIC_ORIGIN = "https://mahjong.utcode.net";

// 本体は workers.dev で動き mahjong.utcode.net からは ut-code の中継 Worker 経由で届くため、公開ドメインの Origin も許可する。
// そうしないと Origin とリクエスト先ホストの不一致を CSRF とみなし、ゲーム開始などのサーバー関数が 403 になる
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
  origin: (origin, ctx) => origin === PUBLIC_ORIGIN || origin === new URL(ctx.request.url).origin,
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
}));
