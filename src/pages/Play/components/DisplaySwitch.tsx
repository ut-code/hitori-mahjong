import { Button } from "@mui/material";

type DisplaySwitchProps = {
	display: "sutehai" | "validTiles";
	setDisplay: React.Dispatch<React.SetStateAction<"sutehai" | "validTiles">>;
};
export default function DisplaySwitch(props: DisplaySwitchProps) {
	return (
		<div style={{ height: "2.8rem" }}>
			{props.display === "sutehai" ? (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "40px",
					}}
				>
					<Button
						variant="contained"
						onClick={() => props.setDisplay("sutehai")}
					>
						捨牌表示
					</Button>
					<Button
						variant="outlined"
						onClick={() => props.setDisplay("validTiles")}
					>
						有効牌表示
					</Button>
				</div>
			) : (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "40px",
					}}
				>
					<Button
						variant="outlined"
						onClick={() => props.setDisplay("sutehai")}
					>
						捨牌表示
					</Button>
					<Button
						variant="contained"
						onClick={() => props.setDisplay("validTiles")}
					>
						有効牌表示
					</Button>
				</div>
			)}
		</div>
	);
}
