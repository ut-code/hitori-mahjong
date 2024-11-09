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
import { Hai } from "../../utils/hai";
import { useNavigate } from "react-router-dom";
import judgeAgari from "../../utils/judgeAgari";
import DrawEnd from "./components/DrawEnd.tsx";
import TsumoEnd from "./components/TsumoEnd.tsx";
import FinishGame from "./components/FinishGame.tsx";

export type GameState = {
  kyoku: number;
  junme: number;
};

const GameInterface = () => {
  const navigate = useNavigate();
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
  const [haiyama, setHaiyama] = useState<Hai[]>([]);
  const [tehai, setTehai] = useState<Hai[]>([]);
  const [tsumo, setTsumo] = useState<Hai>({ kind: "manzu", value: 1 }); //適当な値を設定している
  const [gameState, setGameState] = useState<GameState>({ kyoku: 1, junme: 1 });
  const [isAgari, setIsAgari] = useState(
    judgeAgari(sortTehai([...tehai, tsumo])),
  );
  const [mentsuSyanten, setMentsuSyanten] = useState(13); //ここでメンツ手のシャンテン数を計算する関数を呼び出す
  const [toitsuSyanten, setToitsuSyanten] = useState(2); //ここでチートイのシャンテン数を計算する関数を呼び出す

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

  useEffect(() => {
    const currentAgari = judgeAgari(sortTehai([...tehai, tsumo]));
    if (currentAgari !== isAgari) {
      // Only set state if there's a change
      setIsAgari(currentAgari);
    }
    setMentsuSyanten(0); //ここでメンツ手のシャンテン数を計算する関数を呼び出す
    setToitsuSyanten(3); //ここでメンツ手のシャンテン数を計算する関数を呼び出す
  }, [tehai, tsumo]);

  const tedashi = (index: number) => {
    const newTehai = [...tehai];
    newTehai.splice(index, 1);
    const sortedTehai = sortTehai([...newTehai, tsumo]);
    setTehai(sortedTehai);
    setTsumo(haiyama[0]);
    setHaiyama(haiyama.slice(1));
    setGameState({
      ...gameState,
      junme: gameState.junme + 1,
    });
  };

  const tsumogiri = () => {
    setTsumo(haiyama[0]);
    setHaiyama(haiyama.slice(1));
    setGameState({
      ...gameState,
      junme: gameState.junme + 1,
    });
  };

  const drawEnd = () => {
    setGameState({
      junme: 1,
      kyoku: gameState.kyoku + 1,
    });
    fetchInitialHaiyama();
    const bonusPoint =
      toitsuSyanten === 0 || mentsuSyanten === 0
        ? 1000
        : toitsuSyanten === 1 || mentsuSyanten === 1
          ? 500
          : 0; //聴牌してたら1000点、イーシャンテンなら500点
    setPlayerInfo((prevInfo) => ({
      ...prevInfo,
      score: prevInfo.score + bonusPoint,
    }));
  };

  const tsumoEnd = () => {
    setGameState({
      junme: 1,
      kyoku: gameState.kyoku + 1,
    });
    fetchInitialHaiyama();
    setPlayerInfo({
      ...playerInfo,
      score: playerInfo.score + 8000,
    });
  };

  const finishGame = () => {
    navigate("/result");
  };

  return (
    <div className={styles.container}>
      {gameState.kyoku <= 4 ? (
        gameState.junme === 18 ? (
          <DrawEnd drawEnd={drawEnd} />
        ) : (
          <div className={styles.container}>
            <Header kyoku={gameState.kyoku} junme={gameState.junme} />
            <div className={styles.gridContainer}>
              {isAgari ? (
                <TsumoEnd tsumoEnd={tsumoEnd} />
              ) : (
                <>
                  <span className={styles.discardArea}>
                    <DiscardArea />
                  </span>
                  <span className={styles.handStatus}>
                    <HandStatus />
                  </span>
                  <span className={styles.waitingTiles}>
                    <WaitingTiles tehai={tehai} />
                  </span>
                </>
              )}
            </div>
            <HandTiles
              tehai={tehai}
              tsumo={tsumo}
              tedashi={tedashi}
              tsumogiri={tsumogiri}
            />
          </div>
        )
      ) : (
        <FinishGame finishGame={finishGame} />
      )}
    </div>
  );
};

export default GameInterface;
