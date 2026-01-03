import { Link, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";

export default function Page() {
	const navigate = useNavigate();
	const anonymousLoginAndStart = async () => {
		const user = await authClient.getSession();
		if (user.data) {
			await authClient.signOut();
		}
		await authClient.signIn.anonymous();
		navigate("/play");
	};
	return (
		<div className="h-screen w-screen bg-[#1A472A] font-serif relative flex justify-center">
			<h1 className="absolute top-1/3 text-center font-bold text-4xl tracking-widest">
				一人麻雀
			</h1>
			<div className="absolute top-1/2 flex flex-col md:flex-row space-y-4 md:space-x-4">
				<button
					onClick={anonymousLoginAndStart}
					type="button"
					className="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 transition-transform duration-150 hover:scale-105"
				>
					プレイ
				</button>
				<Link
					to="/login"
					className="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 flex items-center justify-center transition-transform duration-150 hover:scale-105"
				>
					ログイン
				</Link>
				<Link
					to="/learn"
					className="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 flex items-center justify-center transition-transform duration-150 hover:scale-105"
				>
					チュートリアル
				</Link>
			</div>
		</div>
	);
}
