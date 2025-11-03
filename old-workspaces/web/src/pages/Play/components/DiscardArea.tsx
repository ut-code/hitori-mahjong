import type { Hai, HaiWithID } from "shared/hai";

interface DiscardAreaProps {
	sutehai: Hai[];
}

function DiscardArea(props: DiscardAreaProps) {
	const sutehaiWithID: HaiWithID[] = props.sutehai.map((hai, index) => {
		return {
			kind: hai.kind,
			value: hai.value,
			id: index,
		};
	});
	return (
		<div className="h-[90%] rounded-[1rem] shadow-md">
			<div className="pt-4 justify-center grid grid-cols-[repeat(6,50px)] list-none">
				{sutehaiWithID.map((hai) => (
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
