import {
	type Fetcher,
	redirect,
	type ShouldRevalidateFunctionArgs,
	useFetcher,
} from "react-router";
import { z } from "zod";
import { getDB } from "@/db";
import { getAuth } from "@/features/auth";
import {
	calculateShanten,
	GameError,
	type GameState,
	getAgariScoreDelta,
	getGameState,
	type IndexedHai,
	judgeAgari,
	performAgari,
	performRyukyoku,
	sortTehai,
	TILE_IMAGE_PATHS,
	TOTAL_TSUMO_PER_KYOKU,
	tedashi,
	toGameState,
	tsumogiri,
} from "@/features/game";
import type { Route } from "../+types/play/_index";
import { AgariModal } from "./components/AgariModal";
import { GameHeader } from "./components/GameHeader";
import { HintPanel } from "./components/HintPanel";
import { RyukyokuModal } from "./components/RyukyokuModal";
import { SutehaiDisplay } from "./components/SutehaiDisplay";
import { TehaiDisplay } from "./components/TehaiDisplay";
import { useHints } from "./hooks/useHints";

function computeOptimisticGameState(
	loaderData: GameState,
	discardFetcher: Fetcher<GameState>,
) {
	const fetcherGameState =
		discardFetcher.data && "tehai" in discardFetcher.data
			? discardFetcher.data
			: null;

	const currentGameState =
		fetcherGameState?.kyoku === loaderData.kyoku
			? fetcherGameState
			: loaderData;

	const {
		sutehai,
		tsumohai,
		nextTsumohai,
		junme,
		kyoku,
		tehai,
		remainTsumo,
		score,
	} = currentGameState;

	const baseSortedTehai = sortTehai(tehai);

	let optimisticSutehai = sutehai;
	let optimisticTehai = baseSortedTehai;
	let optimisticTsumohai = tsumohai;
	let optimisticJunme = junme;
	let optimisticRemainTsumo = remainTsumo;

	if (
		discardFetcher.state !== "idle" &&
		discardFetcher.formData &&
		tsumohai !== null
	) {
		const intent = discardFetcher.formData.get("intent");
		const nextRemainTsumo = Math.max(0, remainTsumo - 1);

		if (intent === "tedashi") {
			const index = Number(discardFetcher.formData.get("index"));
			if (
				Number.isInteger(index) &&
				index >= 0 &&
				index < baseSortedTehai.length
			) {
				const discardHai = baseSortedTehai[index];
				const remainingTehai = baseSortedTehai.filter((_, i) => i !== index);
				optimisticSutehai = [...sutehai, discardHai];
				optimisticTehai = sortTehai([...remainingTehai, tsumohai]);
				optimisticTsumohai = nextTsumohai;
				optimisticJunme = junme + 1;
				optimisticRemainTsumo = nextRemainTsumo;
			}
		} else if (intent === "tsumogiri") {
			optimisticSutehai = [...sutehai, tsumohai];
			optimisticTsumohai = nextTsumohai;
			optimisticJunme = junme + 1;
			optimisticRemainTsumo = nextRemainTsumo;
		}
	}

	return {
		kyoku,
		score,
		optimisticTehai,
		optimisticTsumohai,
		optimisticSutehai,
		optimisticJunme,
		optimisticRemainTsumo,
		tsumoProgressValue: Math.max(
			0,
			TOTAL_TSUMO_PER_KYOKU - optimisticRemainTsumo,
		),
	};
}

const tedashiSchema = z.object({
	index: z.coerce.number().int().min(0),
});

export const links: Route.LinksFunction = () =>
	TILE_IMAGE_PATHS.map((href) => ({ rel: "preload", as: "image", href }));

export async function loader({ context, request }: Route.LoaderArgs) {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user.id) throw redirect("/");

	const existingGame = await getGameState(getDB(env), session.user.id);
	if (!existingGame) throw redirect("/");

	return toGameState(existingGame);
}

export async function action({ context, request }: Route.ActionArgs) {
	const { env } = context.cloudflare;
	const auth = getAuth(env);
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

	const db = getDB(env);
	const userId = session.user.id;
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "tedashi") {
		const parsed = tedashiSchema.safeParse({ index: formData.get("index") });
		if (!parsed.success)
			return new Response("Invalid form data", { status: 400 });

		const state = await getGameState(db, userId);
		if (state && state.remainTsumo <= 0) return redirect("/play?ryukyoku=1");

		try {
			await tedashi(db, userId, parsed.data.index);
		} catch {
			return new Response("Invalid request", { status: 400 });
		}

		const latestState = await getGameState(db, userId);
		if (!latestState)
			return new Response("Game state not found", { status: 404 });
		return toGameState(latestState);
	}

	if (intent === "tsumogiri") {
		const state = await getGameState(db, userId);
		if (state && state.remainTsumo <= 0) return redirect("/play?ryukyoku=1");

		try {
			await tsumogiri(db, userId);
		} catch {
			return new Response("Invalid request", { status: 400 });
		}

		const latestState = await getGameState(db, userId);
		if (!latestState)
			return new Response("Game state not found", { status: 404 });
		return toGameState(latestState);
	}

	if (intent === "agari") {
		try {
			const { isGameOver } = await performAgari(db, userId);
			return isGameOver ? redirect("/gameover") : null;
		} catch (e) {
			if (e instanceof GameError)
				return new Response(e.message, { status: e.status });
			throw e;
		}
	}

	if (intent === "ryukyoku") {
		try {
			const { isGameOver } = await performRyukyoku(db, userId);
			return isGameOver ? redirect("/gameover") : null;
		} catch (e) {
			if (e instanceof GameError)
				return new Response(e.message, { status: e.status });
			throw e;
		}
	}

	return new Response("Unknown intent", { status: 400 });
}

export function shouldRevalidate({
	actionResult,
}: ShouldRevalidateFunctionArgs) {
	// tedashi/tsumogiri return GameState — skip revalidation, use fetcher data for optimistic UI
	if (
		actionResult != null &&
		typeof actionResult === "object" &&
		"tehai" in actionResult
	) {
		return false;
	}
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
