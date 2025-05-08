import { Skeleton } from "@mui/material";
import styles from "../styles/WaitingTiles.module.css";

export default function WaitingTilesSkeleton() {
	return (
		<div className={styles.waitingTiles}>
			<Skeleton
				variant="rectangular"
				sx={{ padding: "0px", width: "5em", height: "3em" }}
			/>
			<Skeleton variant="rectangular" sx={{ height: "70px" }} />
		</div>
	);
}
