import { Hai } from "../../utils/hai";
import { GameState } from "./Play";
import sortTehai from "../../utils/sortTehai";
import judgeAgari from "../../utils/judgeAgari";
import { useState, useEffect, useContext } from "react";
import { exampleHaiyama } from "../../utils/exampleHaiyama";
import { PlayerInfoContext } from "../../App";
import styles from "../../styles/Tehai.module.css";
import Button from "@mui/material/Button";
import React from "react";

type tehaiProps = {
  tehai: Hai[];
  setTehai: (tehai: Hai[]) => void;
  tsumo: Hai;
  setTsumo: (tsumo: Hai) => void;
  haiyama: Hai[];
  setHaiyama: (haiyama: Hai[]) => void;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
};

export default function Tehai(props: tehaiProps) {
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
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
      props.setTehai(sortTehai(data.slice(0, 13)));
      props.setTsumo(data[13]);
      props.setHaiyama(data.slice(14));
      console.log(props.haiyama.slice(0, 13));
    } catch (error) {
      console.error("Failed to fetch initial haiyama:", error);
      props.setTehai(sortTehai(exampleHaiyama.slice(0, 13)));
      props.setTsumo(exampleHaiyama[13]);
      props.setHaiyama(exampleHaiyama.slice(14));
      console.log(exampleHaiyama.slice(0, 13));
    }
  };

  const [isAgari, setIsAgari] = useState(
    judgeAgari(sortTehai([...props.tehai, props.tsumo])),
  );
  useEffect(() => {
    setIsAgari(judgeAgari(sortTehai([...props.tehai, props.tsumo])));
  }, [props.tehai, props.tsumo]);

  const tedashi = (index: number) => {
    const newTehai = [...props.tehai];
    newTehai.splice(index, 1);
    const sortedTehai = sortTehai([...newTehai, props.tsumo]);
    props.setTehai(sortedTehai);
    props.setTsumo(props.haiyama[0]);
    props.setHaiyama(props.haiyama.slice(1));
    props.setGameState({
      ...props.gameState,
      junme: props.gameState.junme + 1,
    });
  };

  const tsumogiri = () => {
    props.setTsumo(props.haiyama[0]);
    props.setHaiyama(props.haiyama.slice(1));
    props.setGameState({
      ...props.gameState,
      junme: props.gameState.junme + 1,
    });
  };
  return (
    <>
      <div>
        東{props.gameState.kyoku}局{props.gameState.junme}巡目{playerInfo.score}
        点持ち
      </div>
      {props.gameState.junme === 18 ? (
        <>
          <div>流局</div>
          <Button
            variant="outlined"
            onClick={() => {
              props.setGameState({
                junme: 1,
                kyoku: props.gameState.kyoku + 1,
              });
              fetchInitialHaiyama();
              setPlayerInfo({ ...playerInfo, score: playerInfo.score - 3900 });
            }}
          >
            確認
          </Button>
        </>
      ) : (
        <>
          {isAgari && (
            <>
              <div>ツモにゃ！！</div>
              <Button
                variant="outlined"
                onClick={() => {
                  props.setGameState({
                    junme: 1,
                    kyoku: props.gameState.kyoku + 1,
                  });
                  fetchInitialHaiyama();
                  setPlayerInfo({
                    ...playerInfo,
                    score: playerInfo.score + 8000,
                  });
                }}
              >
                アガリ
              </Button>
            </>
          )}
          <div>手牌</div>
          <ul className={styles.tehai}>
            {props.tehai.map((hai, index) => (
              <li key={index}>
                <img
                  src={`/hai/${hai.kind}_${hai.value}.png`}
                  alt={`${hai.kind} ${hai.value}`}
                  width="50"
                  height="70"
                />
                <Button variant="outlined" onClick={() => tedashi(index)}>
                  手出し
                </Button>
              </li>
            ))}
          </ul>
          <div>
            <img
              src={`/hai/${props.tsumo.kind}_${props.tsumo.value}.png`}
              alt={`${props.tsumo.kind} ${props.tsumo.value}`}
              width="50"
              height="70"
            />
            <Button variant="outlined" onClick={tsumogiri}>
              ツモ切り
            </Button>
            <br></br>
            <br></br>
          </div>
          {!isAgari && props.gameState.junme <= 8 && (
            <Button
              variant="outlined"
              onClick={() => {
                props.setGameState({
                  junme: 1,
                  kyoku: props.gameState.kyoku + 1,
                });
                fetchInitialHaiyama();
                setPlayerInfo({
                  ...playerInfo,
                  score: playerInfo.score - 1000,
                });
              }}
            >
              オリ
            </Button>
          )}
        </>
      )}
    </>
  );
}
