import type { IndexedHai } from "../play";

type SutehaiDisplayProps = {
	indexedSutehai: IndexedHai[];
};

export function SutehaiDisplay({ indexedSutehai }: SutehaiDisplayProps) {
	return (
		<div>
			<h3 className="text-sm md:text-base mb-1 text-yellow-300">捨て牌</h3>
			<div className="grid grid-cols-6 gap-0 min-h-36 md:min-h-44 content-start bg-[#0F2918] rounded-md p-2 border border-[#1A472A] w-[13rem] md:w-[16rem]">
				{indexedSutehai.map((hai) => (
					<img
						key={hai.index}
						src={`/hai/${hai.kind}_${hai.value}.png`}
						alt={`${hai.kind} ${hai.value}`}
						className="w-8 h-11 md:w-10 md:h-14"
					/>
				))}
			</div>
		</div>
	);
}
