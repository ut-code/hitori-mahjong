import React from "react";
import styles from "../styles/WaitingTiles.module.css";
import Tile from "./Tile.tsx";

const WaitingTiles = () => {
  return (
    <div className={styles.waitingTiles}>
      <div className={styles.title}>待ち</div>
      <div className={styles.tiles}>
        <Tile value="二萬" />
        <Tile value="九萬" />
      </div>
    </div>
  );
};

export default WaitingTiles;
