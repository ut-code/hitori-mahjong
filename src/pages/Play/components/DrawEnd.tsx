import React from "react";
import Button from "@mui/material/Button";
import styles from "../styles/DrawEnd.module.css";

type DrawEndProps = {
	drawEnd: () => void;
};
export default function DrawEnd(props: DrawEndProps) {
	return (
		<div className={styles.container}>
			<div className={styles.title}>流局</div>
			<Button
				variant="contained"
				onClick={props.drawEnd}
				className={styles.checkButton}
			>
				確認
			</Button>
		</div>
	);
}
