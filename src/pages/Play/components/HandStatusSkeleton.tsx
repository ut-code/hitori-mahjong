import { Skeleton } from "@mui/material";
import styles from "../styles/HandStatus.module.css";

export default function HandStatusSkelton() {
	return (
		<>
			<div className={styles.handStatus}>
				<div className={styles.statusText}>
					<Skeleton variant="text" />
				</div>
				<div className={styles.details}>
					<Skeleton variant="text" />
					<Skeleton variant="text" />
				</div>
			</div>
		</>
	);
}
