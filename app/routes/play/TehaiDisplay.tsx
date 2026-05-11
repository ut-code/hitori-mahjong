// app/routes/play/TehaiDisplay.tsx
import type { FetcherWithComponents } from "react-router";
import type { Hai } from "@/lib/hai/types";
import type { GameState } from "@/lib/types";
import type { IndexedHai } from "../play";

type TehaiButtonProps = {
	hai: IndexedHai;
	discardFetcher: FetcherWithComponents<GameState>;
};

function TehaiButton({ hai, discardFetcher }: TehaiButtonProps) {
	return (
		<discardFetcher.Form method="post" action="/api/tedashi">
			<input type="hidden" name="index" value={hai.index} />
			<button
				type="submit"
				aria-label={`捨てる ${hai.kind} ${hai.value}`}
				disabled={discardFetcher.state !== "idle"}
			>
				<img
					src={`/hai/${hai.kind}_${hai.value}.png`}
					alt={`${hai.kind} ${hai.value}`}
					className="w-8 h-11 md:w-10 md:h-14 cursor-pointer hover:scale-105 transition-transform"
				/>
			</button>
		</discardFetcher.Form>
	);
}

type TsumoButtonProps = {
	optimisticTsumohai: Hai;
	discardFetcher: FetcherWithComponents<GameState>;
	className: string;
};

function TsumoButton({
	optimisticTsumohai,
	discardFetcher,
	className,
}: TsumoButtonProps) {
	return (
		<discardFetcher.Form method="post" action="/api/tsumogiri">
			<button
				type="submit"
				aria-label={`ツモ切り ${optimisticTsumohai.kind} ${optimisticTsumohai.value}`}
				disabled={discardFetcher.state !== "idle"}
			>
				<img
					src={`/hai/${optimisticTsumohai.kind}_${optimisticTsumohai.value}.png`}
					alt={`${optimisticTsumohai.kind} ${optimisticTsumohai.value}`}
					className={`object-contain cursor-pointer hover:scale-105 transition-transform ${className}`}
				/>
			</button>
		</discardFetcher.Form>
	);
}

type TehaiDisplayProps = {
	indexedTehai: IndexedHai[];
	optimisticTsumohai: Hai | null;
	discardFetcher: FetcherWithComponents<GameState>;
};

export function TehaiDisplay({
	indexedTehai,
	optimisticTsumohai,
	discardFetcher,
}: TehaiDisplayProps) {
	const firstRowTehai = indexedTehai.slice(0, 7);
	const secondRowTehai = indexedTehai.slice(7);

	return (
		<>
			{/* デスクトップ */}
			<div className="hidden md:flex items-end gap-0 bg-[#0F2918] rounded-md p-2 border border-[#1A472A] w-fit">
				{indexedTehai.map((hai) => (
					<TehaiButton
						key={hai.index}
						hai={hai}
						discardFetcher={discardFetcher}
					/>
				))}
				{optimisticTsumohai && (
					<div className="ml-1">
						<TsumoButton
							optimisticTsumohai={optimisticTsumohai}
							discardFetcher={discardFetcher}
							className="w-10 h-14"
						/>
					</div>
				)}
			</div>

			{/* モバイル */}
			<div className="md:hidden bg-[#0F2918] rounded-md p-2 border border-[#1A472A] w-fit">
				<div className="grid grid-cols-7 gap-0">
					{firstRowTehai.map((hai) => (
						<TehaiButton
							key={hai.index}
							hai={hai}
							discardFetcher={discardFetcher}
						/>
					))}
				</div>
				<div className="grid grid-cols-7 gap-0 mt-1">
					{secondRowTehai.map((hai) => (
						<TehaiButton
							key={hai.index}
							hai={hai}
							discardFetcher={discardFetcher}
						/>
					))}
					{optimisticTsumohai && (
						<TsumoButton
							optimisticTsumohai={optimisticTsumohai}
							discardFetcher={discardFetcher}
							className="w-8 h-11"
						/>
					)}
				</div>
			</div>
		</>
	);
}
