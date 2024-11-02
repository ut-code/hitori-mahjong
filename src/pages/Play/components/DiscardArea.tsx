import React from "react";
import styles from "../styles/DiscardArea.module.css";
import Tile from "./Tile";

const DiscardArea = () => {
  return (
    <div className={styles.discardArea}>
      <div className={styles.title}>捨牌</div>
      <div className={styles.tiles}>
        <Tile value="二萬" />
        <Tile value="六萬" />
        <Tile value="九萬" />
      </div>
    </div>
  );
};

export default DiscardArea;
