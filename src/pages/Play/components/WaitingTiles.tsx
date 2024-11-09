import React from "react";
import styles from "../styles/WaitingTiles.module.css";
import Tile from "./Tile.tsx";
import { Hai } from "../../../utils/hai.ts";
import calculateMachihai from "../../../utils/calculateMachihai.ts";

interface WaitingTilesProps {
  tehai: Hai[];
}

function WaitingTiles(props: WaitingTilesProps) {
  const machihai: Hai[] = calculateMachihai(props.tehai);
  return (
    <div className={styles.waitingTiles}>
      <div className={styles.title}>待ち</div>
      {machihai.length === 0 ? (
        <p>なし</p>
      ) : (
        <div className={styles.tiles}>
          {machihai.map((hai, index) => (
            <li key={index}>
              <img
                src={`/hai/${hai.kind}_${hai.value}.png`}
                alt={`${hai.kind} ${hai.value}`}
                width="50"
                height="70"
              />
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default WaitingTiles;
