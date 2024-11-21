import React from "react";
import styles from "../styles/HandStatus.module.css";

type HandStatusProps = {
  mentsuSyanten: number;
  toitsuSyanten: number;
};

function HandStatus(props: HandStatusProps) {
  return (
    <div className={styles.handStatus}>
      <div className={styles.statusText}>向聴数</div>
      <div className={styles.details}>
        {/* メンツ手: {props.mentsuSyanten} */}
        メンツ手: 未実装
        <br />
        {/* 七対子: {props.toitsuSyanten} */}
        七対子: 未実装
      </div>
    </div>
  );
}

export default HandStatus;
