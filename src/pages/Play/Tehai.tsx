import { Hai } from "../../utils/hai";
import { GameState } from "./Play";
import judgeAgari from "../../utils/judgeAgari";
import { useState, useEffect, useContext } from "react";
import { exampleHaiyama } from "../../utils/exampleHaiyama";
import { PlayerInfoContext } from "../../App";
import styles from "../../styles/Tehai.module.css";
import Button from "@mui/material/Button";
import { sortTehai } from "../../utils/hai";
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
  const [mentsuSyanten, setMentsuSyanten] = useState(13); //ここでメンツ手のシャンテン数を計算する関数を呼び出す
  const [toitsuSyanten, setToitsuSyanten] = useState(2); //ここでチートイのシャンテン数を計算する関数を呼び出す
  useEffect(() => {
    setIsAgari(judgeAgari(sortTehai([...props.tehai, props.tsumo])));
    setMentsuSyanten(0); //ここでメンツ手のシャンテン数を計算する関数を呼び出す
    setToitsuSyanten(3); //ここでメンツ手のシャンテン数を計算する関数を呼び出す
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
      {props.gameState.junme === 18 ? (
        <>
          <div className={styles.ryukyoku}>流局</div>
          <Button
            variant="contained"
            onClick={() => {
              props.setGameState({
                junme: 1,
                kyoku: props.gameState.kyoku + 1,
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
            }}
          >
            確認
          </Button>
        </>
      ) : (
        <>
          {props.gameState.junme < 18 && (
            <>
              <div className={styles.gameDescription}>
                東{props.gameState.kyoku}局{props.gameState.junme}巡目
                {playerInfo.score}点持ち
              </div>
              {isAgari && (
                <>
                  <div className={styles.tsumoClaim}>ツモ！！</div>
                  <Button
                    variant="contained"
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
                    確認
                  </Button>
                </>
              )}

              <div className={styles.tehaiContainer}>
                <ul className={styles.tehai}>
                  {props.tehai.map((hai, index) => (
                    <li key={index}>
                      <img
                        src={`/hai/${hai.kind}_${hai.value}.png`}
                        alt={`${hai.kind} ${hai.value}`}
                        width="50"
                        height="70"
                        onClick={() => tedashi(index)} // クリックイベントで関数を実行
                        style={{ cursor: "pointer" }} // クリックできることを示すためにポインターに変更
                      />
                    </li>
                  ))}
                </ul>

                <img
                  src={`/hai/${props.tsumo.kind}_${props.tsumo.value}.png`}
                  alt={`${props.tsumo.kind} ${props.tsumo.value}`}
                  width="50"
                  height="70"
                  onClick={() => tsumogiri()} // クリックイベントでtsumogiri関数を実行
                  style={{ cursor: "pointer" }} // クリックできることを示すためにポインターに変更
                />
              </div>
              <div className={styles.syantenContainer}>
                {!isAgari &&
                  (mentsuSyanten === 0 ? (
                    <div>メンツ手: テンパイ</div>
                  ) : (
                    <div>メンツ手: {mentsuSyanten}シャンテン</div>
                  ))}
                {!isAgari &&
                  (toitsuSyanten === 0 ? (
                    <div>七対子: テンパイ</div>
                  ) : (
                    <div>七対子: {toitsuSyanten}シャンテン</div>
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
