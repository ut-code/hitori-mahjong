import { Link, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";

export default function Page() {
	const navigate = useNavigate();
	const anonymousLoginAndStart = async () => {
		const user = await authClient.getSession();
		if (user.data) {
			const _user = await authClient.signOut();
		}
		const _user = await authClient.signIn.anonymous();
		navigate("/play");
	};
	return (
		<>
			<h1 className="text-5xl text-center pb-1">Hitori Mahjong</h1>
			<div className="flex justify-center items-center flex-col gap-4 py-4">
				<button onClick={anonymousLoginAndStart} className="link" type="button">
					Play as Guest
				</button>
				<Link to="/login" className="link">
					Login
				</Link>
				<Link to="/learn" className="link">
					Learn How to Play
				</Link>
			</div>
		</>
	);
}
