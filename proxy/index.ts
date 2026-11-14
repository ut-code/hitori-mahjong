// ut-code アカウントの D1 が無料プランの上限に達したため、本体と D1 は個人アカウントに移した。
// Custom Domain は utcode.net のゾーンと同じアカウントにしか付けられないので、ドメインを変えないためにこの Worker で中継する。

interface Env {
	UPSTREAM_ORIGIN: string;
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const upstream = new URL(url.pathname + url.search, env.UPSTREAM_ORIGIN);

		// Host 以外のヘッダー(Origin や Cookie)はそのまま渡す。better-auth は Origin を BETTER_AUTH_URL と照合するので、書き換えると認証が通らなくなる
		const headers = new Headers(request.headers);
		headers.set("X-Forwarded-Host", url.host);
		headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));

		// リダイレクトを中継側で辿るとブラウザの URL と Set-Cookie がずれるため、そのままブラウザに返す
		return fetch(upstream, {
			method: request.method,
			headers,
			body: request.body,
			redirect: "manual",
		});
	},
} satisfies ExportedHandler<Env>;
