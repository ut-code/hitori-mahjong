import type { Config } from "@react-router/dev/config";

export default {
	ssr: true,
	// 本体は workers.dev で動き mahjong.utcode.net からは ut-code の中継 Worker 経由で届くため、公開ドメインの Origin を許可する。
	// そうしないと React Router が Origin とホストの不一致を CSRF とみなし、ゲーム開始などの action が 400 になる
	allowedActionOrigins: ["mahjong.utcode.net"],
	future: {
		v8_viteEnvironmentApi: true,
	},
} satisfies Config;
