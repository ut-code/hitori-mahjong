/// <reference types="vite/client" />

import type { JSX } from "@solidjs/web";
import {
	createRootRoute,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/solid-router";
import appCss from "./-app.css?url";

const SITE_URL = "https://mahjong.utcode.net";
const SITE_TITLE = "一人麻雀";
const SITE_DESCRIPTION =
	"一人麻雀で麻雀の基礎が学べる！ランキングで他のプレイヤーと競おう！";
const OGP_IMAGE_URL = `${SITE_URL}/ogp.jpg`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: SITE_TITLE },
			{ name: "description", content: SITE_DESCRIPTION },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:title", content: SITE_TITLE },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:image", content: OGP_IMAGE_URL },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:locale", content: "ja_JP" },
			{ property: "og:site_name", content: SITE_TITLE },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: SITE_TITLE },
			{ name: "twitter:description", content: SITE_DESCRIPTION },
			{ name: "twitter:image", content: OGP_IMAGE_URL },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/logo.svg", type: "image/svg+xml" },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
			},
		],
		styles: [
			{
				children: `html, body { margin: 0; background: #1A472A; color: white; font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }`,
			},
		],
	}),
	shellComponent: RootDocument,
	component: Outlet,
	errorComponent: () => <ErrorPage message="エラーが発生しました。" />,
	notFoundComponent: () => (
		<ErrorPage message="ページが見つかりませんでした。" />
	),
});

function RootDocument(props: { children: JSX.Element }) {
	return (
		<html lang="ja">
			<head>
				<HeadContent />
			</head>
			<body>
				{props.children}
				<Scripts />
			</body>
		</html>
	);
}

function ErrorPage(props: { message: string }) {
	return (
		<div class="h-screen w-screen bg-[#1A472A] font-serif text-white relative flex justify-center">
			<h1 class="absolute top-1/3 text-center font-bold text-4xl tracking-widest">
				{props.message}
			</h1>
			<div class="absolute top-1/2">
				<Link
					to="/"
					class="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
				>
					ホームへ戻る
				</Link>
			</div>
		</div>
	);
}
