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
        {props.mentsuSyanten === 0 ? (
          <>メンツ手: テンパイ</>
        ) : (
          <>メンツ手: {props.mentsuSyanten}シャンテン</>
        )}
        <br />
        {props.toitsuSyanten === 0 ? (
          <>七対子: テンパイ</>
        ) : (
          <>七対子: {props.toitsuSyanten}シャンテン</>
        )}
      </div>
    </div>
  );
}

export default HandStatus;
