import Button from "@mui/material/Button";
import React from "react";
import styles from "../styles/TsumoEnd.module.css";

type TsumoEndProps = {
  tsumoEnd: () => void;
};

export default function TsumoEnd(props: TsumoEndProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>ツモ！！</div>
      <Button
        variant="contained"
        onClick={props.tsumoEnd}
        className={styles.checkButton}
      >
        確認
      </Button>
    </div>
  );
}
