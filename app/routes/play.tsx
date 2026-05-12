import {
	redirect,
	type ShouldRevalidateFunctionArgs,
	useFetcher,
} from "react-router";
import { getAuth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { getGameState, toGameState } from "@/lib/game-service";
import judgeAgari from "@/lib/hai/agari";
import { calculateShanten } from "@/lib/hai/shanten";
import type { Hai } from "@/lib/hai/types";
import { sortTehai } from "@/lib/hai/types";
import { getAgariScoreDelta } from "@/lib/score";
import type { GameState } from "@/lib/types";
import type { Route } from "./+types/play";
import { AgariModal } from "./play/AgariModal";
import { computeOptimisticGameState } from "./play/computeOptimisticGameState";
import { TILE_IMAGE_PATHS } from "./play/constants";
import { GameHeader } from "./play/GameHeader";
import { HintPanel } from "./play/HintPanel";
import { RyukyokuModal } from "./play/RyukyokuModal";
import { SutehaiDisplay } from "./play/SutehaiDisplay";
import { TehaiDisplay } from "./play/TehaiDisplay";
import { useHints } from "./play/useHints";

export type IndexedHai = Hai & { index: number };

export const links: Route.LinksFunction = () =>
	TILE_IMAGE_PATHS.map((href) => ({
		rel: "preload",
		as: "image",
		href,
	}));

export async function loader({ context, request }: Route.LoaderArgs) {
	const { env } = context.cloudflare;
	const db = getDB(env);
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user.id) {
		throw redirect("/");
	}

	const userId = session.user.id;
	const existingGame = await getGameState(db, userId);
	if (!existingGame) {
		throw redirect("/");
	}

	return toGameState(existingGame);
}

export function shouldRevalidate({ formAction }: ShouldRevalidateFunctionArgs) {
	if (formAction?.endsWith("/api/tedashi")) return false;
	if (formAction?.endsWith("/api/tsumogiri")) return false;
	return true;
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const actionFetcher = useFetcher();
	const discardFetcher = useFetcher<GameState>();

	const {
		kyoku,
		score,
		optimisticTehai,
		optimisticTsumohai,
		optimisticSutehai,
		optimisticJunme,
		optimisticRemainTsumo,
		tsumoProgressValue,
	} = computeOptimisticGameState(loaderData, discardFetcher);

	const shantenResult = calculateShanten(optimisticTehai);
	const isHintCalculating = discardFetcher.state !== "idle";
	const {
		showHints,
		hintDiscards,
		isAdvanceHint,
		hasAnyHints,
		handleHintToggle,
	} = useHints(
		optimisticTehai,
		optimisticTsumohai,
		shantenResult,
		optimisticJunme,
		isHintCalculating,
	);

	const isAgari =
		optimisticTehai && optimisticTsumohai
			? judgeAgari(sortTehai([...optimisticTehai, optimisticTsumohai]))
			: false;
	const agariScoreDelta = getAgariScoreDelta(optimisticJunme);
	const isRyukyoku = optimisticRemainTsumo <= 0;
	const ryukyokuShanten = shantenResult.shanten;
	const ryukyokuScoreDelta =
		ryukyokuShanten === 0 ? 3000 : ryukyokuShanten === 1 ? 1000 : 0;

	const indexedSutehai: IndexedHai[] = optimisticSutehai.map((hai, index) => ({
		...hai,
		index,
	}));
	const indexedTehai: IndexedHai[] = optimisticTehai.map((hai, index) => ({
		...hai,
		index,
	}));

	return (
		<div className="min-h-screen bg-[#1A472A] p-3 md:p-4 font-serif text-white flex flex-col">
			{isAgari && optimisticTsumohai && (
				<AgariModal
					optimisticTehai={optimisticTehai}
					optimisticTsumohai={optimisticTsumohai}
					agariScoreDelta={agariScoreDelta}
					optimisticJunme={optimisticJunme}
					actionFetcher={actionFetcher}
				/>
			)}
			{isRyukyoku && (
				<RyukyokuModal
					ryukyokuShanten={ryukyokuShanten}
					ryukyokuScoreDelta={ryukyokuScoreDelta}
					actionFetcher={actionFetcher}
				/>
			)}

			<div className="flex flex-1 items-center justify-center">
				<div className="w-full max-w-6xl">
					<GameHeader
						kyoku={kyoku}
						optimisticJunme={optimisticJunme}
						score={score}
						shantenResult={shantenResult}
						tsumoProgressValue={tsumoProgressValue}
					/>

					<div className="mb-3 md:flex md:items-start md:gap-3 w-full md:w-[50.25rem] mx-auto">
						<SutehaiDisplay indexedSutehai={indexedSutehai} />
						<HintPanel
							showHints={showHints}
							hintDiscards={hintDiscards}
							isAdvanceHint={isAdvanceHint}
							hasAnyHints={hasAnyHints}
							isHintCalculating={isHintCalculating}
							handleHintToggle={handleHintToggle}
						/>
					</div>

					<div className="w-full md:w-[50.25rem] mx-auto">
						<h3 className="text-sm md:text-base mb-1 text-yellow-300">手牌</h3>
						<TehaiDisplay
							indexedTehai={indexedTehai}
							optimisticTsumohai={optimisticTsumohai}
							discardFetcher={discardFetcher}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
