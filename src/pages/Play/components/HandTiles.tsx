import React from "react";
import styles from "../styles/HandTiles.module.css";
import { Hai } from "../../../utils/hai";

type HandTilesProps = {
  tehai: Hai[];
  tsumo: Hai;
  tedashi: (index: number) => void;
  tsumogiri: () => void;
};
function HandTiles(props: HandTilesProps) {
  return (
    <>
      <div className={styles.tilesContainer}>
        <ul className={styles.tiles}>
          {props.tehai.map((hai, index) => (
            <li key={index}>
              <img
                src={`/hai/${hai.kind}_${hai.value}.png`}
                alt={`${hai.kind} ${hai.value}`}
                width="50"
                height="70"
                onClick={() => props.tedashi(index)} // クリックイベントで関数を実行
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
          onClick={() => props.tsumogiri()} // クリックイベントでtsumogiri関数を実行
          style={{ cursor: "pointer" }} // クリックできることを示すためにポインターに変更
        />
      </div>
    </>
  );
}

export default HandTiles;
