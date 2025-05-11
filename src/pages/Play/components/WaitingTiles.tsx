import calculateMachihai from "../../../utils/calculateMachihai";
import type { Hai } from "../../../utils/hai";

interface WaitingTilesProps {
	tehai: Hai[];
}

function WaitingTiles(props: WaitingTilesProps) {
	const machihai: Hai[] = calculateMachihai(props.tehai);
	return (
		<div
			style={{
				paddingBottom: "6rem",
				borderRadius: "1rem",
				boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
			}}
		>
			<div
				style={{
					paddingTop: "0.5rem",
					paddingLeft: "1rem",
					fontSize: "1.5rem",
					textAlign: "left",
					fontWeight: "500",
				}}
			>
				待ち
			</div>
			{machihai.length === 0 ? (
				<div
					style={{
						paddingLeft: "1.5rem",
						fontSize: "1.3rem",
						fontWeight: "500",
					}}
				>
					なし
				</div>
			) : (
				<div
					style={{
						listStyleType: "none",
						display: "flex",
						paddingLeft: "1.3rem",
						paddingTop: "0.5rem",
					}}
				>
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
