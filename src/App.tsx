import { useState } from "react";
import NotFound from "./pages/NotFound/NotFound";
import GameInterface from "./pages/Play/GameInterface";
import Result from "./pages/Result/Result";
import Start from "./pages/Start/Start";
import Tutorial from "./pages/Tutorial/Tutorial";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

export type PlayerInfo = {
	rank: number | null;
	name: string;
	score: number;
};

// this wakes up the server when someone visits the website
(async () => {
	const apiUrl = import.meta.env.VITE_API_URL;
	await fetch(`${apiUrl}/health`);
})();

function App() {
	const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
		rank: null,
		name: "",
		score: 25000,
	});
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Start setPlayerInfo={setPlayerInfo} />} />
				<Route path="/tutorial" element={<Tutorial />} />
				<Route
					path="/play"
					element={
						<GameInterface
							playerInfo={playerInfo}
							setPlayerInfo={setPlayerInfo}
						/>
					}
				/>
				<Route path="/result" element={<Result playerInfo={playerInfo} />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default App;
