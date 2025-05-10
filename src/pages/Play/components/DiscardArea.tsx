import { Hai } from "../../../utils/hai";

interface DiscardAreaProps {
	sutehai: Hai[];
}

function DiscardArea(props: DiscardAreaProps) {
	return (
		<div
			style={{
				height: "20.5rem",
				borderRadius: "1rem",
				boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
			}}
		>
			<div
				style={{
					paddingTop: "1rem",
					justifyContent: "center",
					display: "grid",
					gridTemplateColumns: "repeat(6, 50px)",
					listStyle: "none",
				}}
			>
				{props.sutehai.map((hai, index) => (
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
		</div>
	);
}

export default DiscardArea;
