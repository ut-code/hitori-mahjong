import styles from "../styles/WaitingTiles.module.css";
import { Hai } from "../../../utils/hai";
import calculateMachihai from "../../../utils/calculateMachihai";

interface WaitingTilesProps {
	tehai: Hai[];
}

function WaitingTiles(props: WaitingTilesProps) {
	const machihai: Hai[] = calculateMachihai(props.tehai);
	return (
		<div className={styles.waitingTiles}>
			<div className={styles.title}>待ち</div>
			{machihai.length === 0 ? (
				<p className={styles.nothing}>なし</p>
			) : (
				<div className={styles.tiles}>
					{machihai.map((hai, index) => (
						<li key={index}>
							<img
								src={`/hai/${hai.kind}_${hai.value}.png`}
								alt={`${hai.kind} ${hai.value}`}
								width="50"
								height="70"
							/>
						</li>
					))}
				</div>
			)}
		</div>
	);
}

export default WaitingTiles;
