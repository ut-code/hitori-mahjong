import styles from "../styles/HandTiles.module.css";
import { Skeleton } from "@mui/material";

export default function HandTileSkelton() {
	const arr = new Array(14).fill(0);
	return (
		<div className={styles.tilesContainer}>
			<ul className={styles.tiles}>
				{arr.map((_, index) => (
					<li key={index}>
						<Skeleton variant="rectangular" width={50} height={70} />
					</li>
				))}
			</ul>
		</div>
	);
}
