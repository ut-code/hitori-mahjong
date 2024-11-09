import React from "react";
import styles from "../styles/WaitingTiles.module.css";
import Tile from "./Tile.tsx";
import { Hai } from "../../../utils/hai.ts";

interface WaitingTilesProps {
  mentsuSyanten: number;
  toitsuSyanten: number;
  tehai: Hai[];
}

function WaitingTiles(props: WaitingTilesProps) {
  return (
    <div className={styles.waitingTiles}>
      <div className={styles.title}>待ち</div>
      <div className={styles.tiles}>
        <Tile value="二萬" />
        <Tile value="九萬" />
      </div>
    </div>
  );
}

export default WaitingTiles;
