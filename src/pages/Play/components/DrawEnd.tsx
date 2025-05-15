import Button from "@mui/material/Button";

type DrawEndProps = {
	drawEnd: () => void;
};
export default function DrawEnd(props: DrawEndProps) {
	return (
		<>
			<div
				style={{
					justifyContent: "center",
				}}
			>
				<div
					style={{
						marginTop: "10px",
						fontFamily:
							"Noto Serif JP, Source Han Serif JP, Hiragino Mincho ProN,Yu Mincho, serif",
						fontSize: "80px",
						marginBottom: "20px",
					}}
				>
					流局
				</div>
				<Button
					variant="contained"
					onClick={props.drawEnd}
					sx={{
						width: "max-content",
						height: "20%",
					}}
				>
					確認
				</Button>
			</div>
		</>
	);
}
