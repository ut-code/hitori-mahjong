import type { Hai, JihaiValue, HaiKind } from "../../../utils/hai";

interface DiscardAreaProps {
	sutehai: Hai[];
}

type HaiWithID = {
	kind: HaiKind;
	value: JihaiValue | number;
	id: number;
};

function DiscardArea(props: DiscardAreaProps) {
	const sutehaiWithId: HaiWithID[] = props.sutehai.map((hai, index) => {
		return {
			kind: hai.kind,
			value: hai.value,
			id: index,
		};
	});
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
				{sutehaiWithId.map((hai) => (
					<li key={hai.id}>
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
