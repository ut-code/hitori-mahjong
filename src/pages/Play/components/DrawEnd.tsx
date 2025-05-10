import React from "react";
import Button from "@mui/material/Button";

type DrawEndProps = {
	drawEnd: () => void;
};
export default function DrawEnd(props: DrawEndProps) {
	return (
		<div
			style={{
				backgroundColor: "white",
				justifyContent: "center",
				minWidth: "80vw",
				minHeight: "80vh",
				borderRadius: "1rem",
			}}
		>
			<div
				style={{
					paddingTop: "2rem",
					fontSize: "5rem",
				}}
			>
				流局
			</div>
			<Button
				variant="contained"
				onClick={props.drawEnd}
				sx={{
					marginTop: "3rem",
					width: "10rem",
					height: "5rem",
					fontSize: "2rem",
					borderRadius: "1rem",
				}}
			>
				確認
			</Button>
		</div>
	);
}
