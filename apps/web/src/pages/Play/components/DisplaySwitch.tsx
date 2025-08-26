import { Button } from "@mui/material";

type DisplaySwitchProps = {
	display: "sutehai" | "validTiles";
	setDisplay: React.Dispatch<React.SetStateAction<"sutehai" | "validTiles">>;
};
export default function DisplaySwitch(props: DisplaySwitchProps) {
	return (
		<div className="h-[10%]">
			{props.display === "sutehai" ? (
				<div className="flex justify-center gap-10">
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
				<div className="flex justify-center gap-10">
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
