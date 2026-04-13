export default function LocalRule() {
	return (
		<>
			<div className="text-2xl font-bold mb-6">ローカルルール</div>

			<ul className="list-disc ml-6 mb-8 space-y-4">
				<li className="leading-relaxed text-sm">
					牌を18巡ツモって、流局までにアガれたら+8000点、アガれなくても流局時にテンパイしていたら+1000点、イーシャンテンでも+500点となっています。実戦では流局時にイーシャンテンでも点数はもらえないのですが、
					<u>一人麻雀はパズルとして楽しんでほしい</u>
					ので、シャンテン数を進めたということで、点数がもらえます。
				</li>
				<li className="leading-relaxed text-sm">
					手牌の画像をクリックしたら、その牌が捨てられ、新しい牌をツモることができます。
				</li>
				<li className="leading-relaxed text-sm">
					鳴きやオリといった要素がないので、字牌は牌山に含まれていません。
				</li>
				<li className="leading-relaxed text-sm">
					東風戦になります。東4局でアガるか流局すれば、終局となります。
				</li>
				<li className="leading-relaxed text-sm">
					プレイ画面の有効牌表示では、シャンテン数が進む打牌を最大10個ずつ表示しています。シャンテン数を進めることが必ずしもアガリに近づくわけではないですが、一つの指標にしてください。
				</li>
			</ul>
		</>
	);
}
