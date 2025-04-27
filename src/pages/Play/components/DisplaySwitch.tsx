import { Button } from "@mui/material";
import styles from "../styles/DisplaySwitch.module.css";

type DisplaySwitchProps = {
	display: "sutehai" | "validTiles";
	setDisplay: React.Dispatch<React.SetStateAction<"sutehai" | "validTiles">>;
};
export default function DisplaySwitch(props: DisplaySwitchProps) {
	return (
		<>
			{props.display === "sutehai" ? (
				<div className={styles.buttonContainer}>
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
				<div className={styles.buttonContainer}>
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
		</>
	);
}
