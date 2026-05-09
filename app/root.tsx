import {
	isRouteErrorResponse,
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
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
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<style>{`
					html,
					body {
						margin: 0;
						background: #1A472A;
						color: white;
						font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
					}
				`}</style>
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let details = "エラーが発生しました。";

	if (isRouteErrorResponse(error)) {
		details =
			error.status === 404
				? "ページが見つかりませんでした。"
				: error.statusText || details;
	}
	return (
		<div className="h-screen w-screen bg-[#1A472A] font-serif text-white relative flex justify-center">
			<h1 className="absolute top-1/3 text-center font-bold text-4xl tracking-widest">
				{details}
			</h1>
			<div className="absolute top-1/2">
				<Link
					to="/"
					className="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
				>
					ホームへ戻る
				</Link>
			</div>
		</div>
	);
}
