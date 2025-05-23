import calculateMachihai from "../../../utils/calculateMachihai";
import type { Hai, HaiWithID } from "../../../utils/hai";

interface WaitingTilesProps {
	tehai: Hai[];
}

function WaitingTiles(props: WaitingTilesProps) {
	const machihai: Hai[] = calculateMachihai(props.tehai);
	const machihaiWithId: HaiWithID[] = machihai.map((hai, index) => {
		return {
			value: hai.value,
			kind: hai.kind,
			id: index,
		};
	});
	return (
		<div className="h-full rounded-[1rem] shadow-md">
			<div className="pt-2 pl-4 text-2xl text-left font-medium">待ち</div>
			{machihai.length === 0 ? (
				<div className="pl-6 text-xl font-medium">なし</div>
			) : (
				<div className="list-none flex pl-5 pt-2">
					{machihaiWithId.map((hai) => (
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
			)}
		</div>
	);
}

export default WaitingTiles;
