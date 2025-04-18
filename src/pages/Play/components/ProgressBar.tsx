import React from "react";
import styles from "../styles/ProgressBar.module.css";
import { Box } from "@mui/material";

const ProgressBar = ({ progress, label }) => {
	return (
		<Box className={styles.progressWrapper}>
			<Box className={styles.progressContainer}>
				<Box className={styles.progressBar} style={{ width: `${progress}%` }} />
				{/* <Box className={styles.progressLabel}>{progress}%</Box> */}
			</Box>
			{/*       <Box className={styles.arrowContainer} style={{ left: `${progress}%` }}>
        <div className={styles.arrow}></div>
        {<div className={styles.arrowText}>{label}</div>}
      </Box> */}
			<Box
				className={styles.labelContainer}
				style={{ left: `${progress}%` }} // Adjusts label position
			>
				<div className={styles.labelText}>{label}</div>
			</Box>
		</Box>
	);
};

export default ProgressBar;
