import React from "react";
import styles from "./styles/GameInterface.module.css";
import Header from "./components/Header.tsx";
import DiscardArea from "./components/DiscardArea.tsx";
import HandStatus from "./components/HandStatus.tsx";
import WaitingTiles from "./components/WaitingTiles.tsx";
import HandTiles from "./components/HandTiles.tsx";
import { useState, useEffect, useContext } from "react";
import { sortTehai } from "../../utils/hai";
import { exampleHaiyama } from "../../utils/exampleHaiyama";
import { PlayerInfoContext } from "../../App";
import Button from "@mui/material/Button";
import { Hai } from "../../utils/hai";
import { useNavigate } from "react-router-dom";

export type GameState = {
  kyoku: number;
  junme: number;
};

const GameInterface = () => {
  const navigate = useNavigate();
  const { playerInfo } = useContext(PlayerInfoContext);
  const [haiyama, setHaiyama] = useState<Hai[]>([]);
  const [tehai, setTehai] = useState<Hai[]>([]);
  const [tsumo, setTsumo] = useState<Hai>({ kind: "manzu", value: 1 }); //適当な値を設定している
  const [gameState, setGameState] = useState<GameState>({ kyoku: 1, junme: 1 });

  const fetchInitialHaiyama = async () => {
    try {
      const response = await fetch("/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // 最初の13枚をtehaiに、その次をtsumoに、残りをhaiyamaにセット
      setTehai(sortTehai(data.slice(0, 13)));
      setTsumo(data[13]);
      setHaiyama(data.slice(14));
      console.log(haiyama.slice(0, 13));
    } catch (error) {
      console.error("Failed to fetch initial haiyama:", error);
      setTehai(sortTehai(exampleHaiyama.slice(0, 13)));
      setTsumo(exampleHaiyama[13]);
      setHaiyama(exampleHaiyama.slice(14));
      console.log(exampleHaiyama.slice(0, 13));
    }
  };

  useEffect(() => {
    fetchInitialHaiyama();
  }, []);
  useEffect(() => {
    if (gameState.kyoku === 5) {
      const sendResult = () => {
        fetch("/end", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify({
            name: playerInfo.name,
            score: playerInfo.score,
          }),
        });
      };
      sendResult();
    }
  }, [gameState.kyoku]);

  return gameState.kyoku <= 4 ? (
    <div className={styles.container}>
      <Header />
      <div className={styles.gridContainer}>
        <span className={styles.discardArea}>
          <DiscardArea />
        </span>
        <span className={styles.handStatus}>
          <HandStatus />
        </span>
        <span className={styles.waitingTiles}>
          <WaitingTiles />
        </span>
      </div>
      <HandTiles />
    </div>
  ) : (
    <>
      <div>終局</div>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/result");
        }}
      >
        結果画面へ
      </Button>
    </>
  );
};

export default GameInterface;
