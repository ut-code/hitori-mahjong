import React from "react";
import styles from "../styles/DiscardArea.module.css";
import Tile from "./Tile";
import { Hai } from "../../../utils/hai.ts";

interface DiscardAreaProps {
  sutehai: Hai[];
}

function DiscardArea(props: DiscardAreaProps) {
  return (
    <div className={styles.discardArea}>
      <div className={styles.title}>捨牌</div>
      <div className={styles.tiles}>
        {props.sutehai.map((hai, index) => (
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
    </div>
  );
}

export default DiscardArea;
