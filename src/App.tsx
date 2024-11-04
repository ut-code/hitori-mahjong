import React, { useState, createContext } from "react";
import Start from "./pages/Start/Start";
import Tutorial from "./pages/Tutorial/Tutorial";
import Play from "./pages/Play/Play";
import GameInterface from "./pages/Play/GameInterface";
import Result from "./pages/Result/Result";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export type PlayerInfo = {
  rank: number | null;
  name: string;
  score: number;
};

export const PlayerInfoContext = createContext<{
  playerInfo: PlayerInfo;
  setPlayerInfo: React.Dispatch<React.SetStateAction<PlayerInfo>>;
}>({
  playerInfo: { rank: null, name: "", score: 25000 },
  setPlayerInfo: () => {},
});

function App() {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    rank: null,
    name: "",
    score: 25000,
  });
  return (
    <PlayerInfoContext.Provider value={{ playerInfo, setPlayerInfo }}>
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/play" element={<GameInterface />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Router>
    </PlayerInfoContext.Provider>
  );
}

export default App;
