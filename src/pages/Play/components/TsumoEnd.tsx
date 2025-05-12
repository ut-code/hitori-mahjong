import Button from "@mui/material/Button";

type TsumoEndProps = {
	tsumoEnd: () => void;
};

export default function TsumoEnd(props: TsumoEndProps) {
	return (
		<div
			style={{
				justifyContent: "center",
				height: "20rem",
				width: "70rem",
				margin: "0 auto",
				transform: "translateY(3rem)",
			}}
		>
			<div
				style={{
					fontFamily:
						"Noto Serif JP, Source Han Serif JP, Hiragino Mincho ProN, Yu Mincho, serif",
					fontSize: "8rem",
					fontWeight: "1000",
					color: "red",
				}}
			>
				ツモ！
			</div>
			<Button
				variant="contained"
				onClick={props.tsumoEnd}
				sx={{
					width: "8rem",
					height: "4rem",
				}}
			>
				確認
			</Button>
		</div>
	);
}
