import React, { useState, createContext } from "react";
import Start from "./pages/Start/Start";
import Tutorial from "./pages/Tutorial/Tutorial";
import Play from "./pages/Play/Play";
import Result from "./pages/Result/Result";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";

export type PlayerInfo = {
  name: string;
  score: number;
};

export const PlayerInfoContext = createContext<{
  playerInfo: PlayerInfo;
  setPlayerInfo: React.Dispatch<React.SetStateAction<PlayerInfo>>;
}>({
  playerInfo: { name: "", score: 25000 },
  setPlayerInfo: () => {},
});

function App() {
  const [uiState, setUiState] = useState("Start");
  const [playerInfo, setPlayerInfo] = useState({ name: "", score: 25000 });
  return (
    <PlayerInfoContext.Provider value={{ playerInfo, setPlayerInfo }}>
      <CssBaseline />
      {uiState === "Start" && <Start setUiState={setUiState} />}
      {uiState === "Tutorial" && <Tutorial setUiState={setUiState} />}
      {uiState === "Play" && <Play setUiState={setUiState} />}
      {uiState === "Result" && <Result setUiState={setUiState} />}
    </PlayerInfoContext.Provider>
  );
}

export default App;
