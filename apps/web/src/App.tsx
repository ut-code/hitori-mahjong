import { useState } from "react";
import { Route, Routes } from "react-router";
import NotFound from "./pages/NotFound/NotFound";
import GameInterface from "./pages/Play/GameInterface";
import Result from "./pages/Result/Result";
import Start from "./pages/Start/Start";
import BasicRules from "./pages/Tutorial/BasicRules";
import LocalRules from "./pages/Tutorial/LocalRules";
import Tutorial from "./pages/Tutorial/Tutorial";
import "./App.css";

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
		<div
			style={{
				fontFamily: "YuMincho, Hiragino Mincho ProN, serif",
			}}
		>
			<Routes>
				<Route index element={<Start setPlayerInfo={setPlayerInfo} />} />
				<Route path="tutorial" element={<Tutorial />}>
					<Route index element={<BasicRules />} />
					<Route path="basic" element={<BasicRules />} />
					<Route path="local" element={<LocalRules />} />
				</Route>
				<Route
					path="play"
					element={
						<GameInterface
							playerInfo={playerInfo}
							setPlayerInfo={setPlayerInfo}
						/>
					}
				/>
				<Route path="result" element={<Result playerInfo={playerInfo} />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
