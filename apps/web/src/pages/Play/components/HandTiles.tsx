import type { Hai, HaiWithID } from "../../../utils/hai";

type HandTilesProps = {
	tehai: Hai[];
	tsumo: Hai;
	tedashi: (index: number) => void;
	tsumogiri: () => void;
};
function HandTiles(props: HandTilesProps) {
	const tehaiWithID: HaiWithID[] = props.tehai.map((hai, index) => {
		return {
			kind: hai.kind,
			value: hai.value,
			id: index,
		};
	});
	return (
		<>
			<div className="flex justify-center">
				<ul className="flex list-none">
					{tehaiWithID.map((hai) => (
						<li key={hai.id}>
							<img
								src={`/hai/${hai.kind}_${hai.value}.png`}
								alt={`${hai.kind} ${hai.value}`}
								width="50"
								height="70"
								onClick={() => props.tedashi(hai.id)} // クリックイベントで関数を実行
								onKeyDown={() => props.tedashi(hai.id)} // 意味あるのか分からない
								style={{ cursor: "pointer" }} // クリックできることを示すためにポインターに変更
							/>
						</li>
					))}
				</ul>

				<img
					src={`/hai/${props.tsumo.kind}_${props.tsumo.value}.png`}
					alt={`${props.tsumo.kind} ${props.tsumo.value}`}
					width="50"
					height="70"
					onClick={() => props.tsumogiri()} // クリックイベントでtsumogiri関数を実行
					onKeyDown={() => props.tsumogiri()} // 意味あるのか分からない
					style={{ cursor: "pointer", transform: "translate(0.5rem, 1.5rem)" }} // クリックできることを示すためにポインターに変更
				/>
			</div>
		</>
	);
}

export default HandTiles;
