import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/NotFound.module.css";

const NotFound = () => {
	const navigate = useNavigate();
	return (
		<div className={styles.container}>
			<h1>404 - Page Not Found</h1>
			<Button
				variant="contained"
				onClick={() => {
					navigate("/");
				}}
				className={styles.link}
			>
				ホームに戻る
			</Button>
		</div>
	);
};

export default NotFound;
