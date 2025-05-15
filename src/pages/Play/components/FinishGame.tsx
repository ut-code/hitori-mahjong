import Button from "@mui/material/Button";
import React from "react";
import styles from "../styles/FinishGame.module.css";

type FinishGameProps = {
	finishGame: () => void;
};
export default function FinishGame(props: FinishGameProps) {
	return (
		<div className={styles.container}>
			<div className={styles.title}>終局</div>
			<Button
				variant="contained"
				onClick={props.finishGame}
				className={styles.checkButton}
			>
				結果画面へ
			</Button>
		</div>
	);
}
