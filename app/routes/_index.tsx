import { Link, useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";
import github from "/github.svg";
import logo from "/logo.svg";

export default function Page() {
	const navigate = useNavigate();
	const anonymousLoginAndStart = async () => {
		const user = await authClient.getSession();
		if (!user.data) {
			await authClient.signIn.anonymous();
		}
		navigate("/play");
	};
	return (
		<div className="h-screen w-screen bg-[#1A472A] font-serif text-white relative flex justify-center">
			<h1 className="absolute top-1/3 text-center font-bold text-4xl tracking-widest">
				一人麻雀
			</h1>
			<div className="absolute top-1/2 flex flex-col md:flex-row items-center space-y-4 md:space-x-4 md:space-y-0">
				<button
					onClick={anonymousLoginAndStart}
					type="button"
					className="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 transition-transform duration-150 hover:scale-105 text-white"
				>
					プレイ
				</button>
				<Link
					to="/learn"
					className="bg-yellow-600 rounded text-sm w-full md:w-30 h-10 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
				>
					チュートリアル
				</Link>
			</div>

			<div className="absolute bottom-4 text-xs text-gray-400 flex gap-4">
				<a href="https://utcode.net" target="_blank" rel="noopener noreferrer">
					<img src={logo} alt="Logo" className="w-10" />
				</a>

				<a
					href="https://github.com/ut-code/hitori-mahjong"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src={github} alt="Logo" className="w-10 invert" />
				</a>
			</div>
		</div>
	);
}
