import { Link } from "react-router";

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
