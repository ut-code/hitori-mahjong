import { useState, useEffect, useContext } from "react";
import Tehai from "./Tehai";
import { sortTehai } from "../../utils/hai";
import { exampleHaiyama } from "../../utils/exampleHaiyama";
import { PlayerInfoContext } from "../../App";
import Button from "@mui/material/Button";
import { Hai } from "../../utils/hai";
import React from "react";
import styles from "../../styles/Play.module.css";
import { useNavigate } from "react-router-dom";

export type GameState = {
  kyoku: number;
  junme: number;
};

export default function Play() {
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
  return (
    <>
      {gameState.kyoku <= 4 ? (
        <>
          <div className={styles.container}>
            <Tehai
              tehai={tehai}
              setTehai={setTehai}
              tsumo={tsumo}
              setTsumo={setTsumo}
              haiyama={haiyama}
              setHaiyama={setHaiyama}
              gameState={gameState}
              setGameState={setGameState}
            />
          </div>
        </>
      ) : (
        <div className={styles.syukyokuContainer}>
          <div className={styles.syukyoku}>終局</div>

          <Button
            variant="contained"
            onClick={() => {
              navigate("/result");
            }}
          >
            結果画面へ
          </Button>
        </div>
      )}
    </>
  );
}
