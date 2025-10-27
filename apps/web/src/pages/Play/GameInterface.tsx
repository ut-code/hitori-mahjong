import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Hai } from "shared/hai";
import { sortTehai } from "shared/hai";
import type { PlayerInfo } from "../../App";
import calculateSyantenMentsu from "../../utils/calculateSyantenMentsu";
import calculateSyantenToitsu from "../../utils/calculateSyantenToitsu";
import judgeAgari from "../../utils/judgeAgari";
import DiscardArea from "./components/DiscardArea";
import DisplaySwitch from "./components/DisplaySwitch";
import DrawEnd from "./components/DrawEnd";
import FinishGame from "./components/FinishGame";
import HandStatus from "./components/HandStatus";
import HandStatusSkelton from "./components/HandStatusSkeleton";
import HandTileSkelton from "./components/HandTileSkeleton";
import HandTiles from "./components/HandTiles";
import Header from "./components/Header";
import TsumoEnd from "./components/TsumoEnd";
import ValidTiles from "./components/ValidTiles";
import WaitingTiles from "./components/WaitingTiles";
import WaitingTilesSkeleton from "./components/WaitingTilesSkeleton";

export type GameState = {
	kyoku: number;
	junme: number;
	haiyama: Hai[];
	tehai: Hai[];
	tsumo: Hai;
	isAgari: boolean;
	mentsuSyanten: number;
	toitsuSyanten: number;
	sutehai: Hai[];
};

type GameInterfaceProps = {
	playerInfo: PlayerInfo;
	setPlayerInfo: React.Dispatch<React.SetStateAction<PlayerInfo>>;
};

const GameInterface = (props: GameInterfaceProps) => {
	const navigate = useNavigate();
	const [gameState, setGameState] = useState<GameState>({
		kyoku: 1,
		junme: 1,
		haiyama: [],
		tehai: [],
		tsumo: { kind: "jihai", value: "haku" },
		isAgari: false,
		mentsuSyanten: 100,
		toitsuSyanten: 100,
		sutehai: [],
	});
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [isAborted, setIsAborted] = useState(false);
	const [display, setDisplay] = useState<"sutehai" | "validTiles">("sutehai");
	const apiUrl = import.meta.env.VITE_API_URL;

	const sendResult = useCallback(async () => {
		try {
			fetch(`${apiUrl}/scores`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				mode: "cors",
				body: JSON.stringify({
					name: props.playerInfo.name,
					score: props.playerInfo.score,
				}),
			});
			console.log("result sent");
		} catch (error) {
			console.error("failed in creating score", error);
		}
	}, [props.playerInfo]);

	useEffect(() => {
		const fetchNextState = async (): Promise<GameState | undefined> => {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 5000);
			try {
				setIsLoading(true);
				const response = await fetch(`${apiUrl}/tiles`, {
					method: "GET",
					mode: "cors",
					signal: controller.signal,
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();

				const nextGameState = {
					kyoku: gameState.kyoku,
					junme: 1,
					tehai: sortTehai(data.slice(0, 13)),
					tsumo: data[13],
					haiyama: data.slice(14),
					isAgari: judgeAgari([...data.slice(0, 13), data[13]]),
					mentsuSyanten: calculateSyantenMentsu(data.slice(0, 13)),
					toitsuSyanten: calculateSyantenToitsu(data.slice(0, 13)),
					sutehai: [],
				};
				setIsLoading(false);
				return nextGameState;
			} catch (error) {
				setIsLoading(true);
				console.error("failed in fetching initial haiyama:", error);
				if (error instanceof DOMException && error.name === "AbortError") {
					//タイムアウトしたときの処理を追加
					setIsAborted(true);
				}
				setOpen(true);
			} finally {
				clearTimeout(timeout);
			}
		};
		const initializeGameState = async () => {
			const nextState = await fetchNextState();
			if (nextState) {
				setGameState(nextState);
			}
		};
		initializeGameState();
	}, [gameState.kyoku]);
	//TODO: tedashiとtsumogiri, drawEndとtsumoEndをそれぞれ同じ関数にする
	const tedashi = (index: number) => {
		const nextTehai = sortTehai([
			...gameState.tehai.slice(0, index),
			...gameState.tehai.slice(index + 1),
			gameState.tsumo,
		]);
		const nextState = {
			...gameState,
			junme: gameState.junme + 1,
			haiyama: gameState.haiyama.slice(1),
			tehai: nextTehai,
			tsumo: gameState.haiyama[0],
			isAgari: judgeAgari([...nextTehai, gameState.haiyama[0]]),
			mentsuSyanten: calculateSyantenMentsu(nextTehai),
			toitsuSyanten: calculateSyantenToitsu(nextTehai),
			sutehai: [...gameState.sutehai, gameState.tehai[index]],
		};
		setGameState(nextState);
	};

	const tsumogiri = () => {
		const nextState = {
			...gameState,
			junme: gameState.junme + 1,
			haiyama: gameState.haiyama.slice(1),
			tsumo: gameState.haiyama[0],
			isAgari: judgeAgari([...gameState.tehai, gameState.haiyama[0]]),
			mentsuSyanten: calculateSyantenMentsu(gameState.tehai),
			toitsuSyanten: calculateSyantenToitsu(gameState.tehai),
			sutehai: [...gameState.sutehai, gameState.tsumo],
		};
		setGameState(nextState);
	};

	const drawEnd = () => {
		const nextState = {
			...gameState,
			kyoku: gameState.kyoku + 1,
		};
		if (nextState.kyoku === 5) {
			sendResult();
		}
		setGameState(nextState);

		const bonusPoint =
			gameState.toitsuSyanten === 0 || gameState.mentsuSyanten === 0
				? 1000
				: gameState.toitsuSyanten === 1 || gameState.mentsuSyanten === 1
					? 500
					: 0; //聴牌してたら1000点、イーシャンテンなら500点
		props.setPlayerInfo((prevInfo) => ({
			...prevInfo,
			score: prevInfo.score + bonusPoint,
		}));
	};

	const tsumoEnd = () => {
		const nextState = {
			...gameState,
			kyoku: gameState.kyoku + 1,
		};
		if (nextState.kyoku === 5) {
			sendResult();
		}
		setGameState(nextState);

		props.setPlayerInfo({
			...props.playerInfo,
			score: props.playerInfo.score + 8000,
		});
	};

	const finishGame = () => {
		navigate("/result");
	};

	return (
		<div className="p-4 w-[80vw] h-[80vh] bg-white rounded-[1rem] overflow-hidden">
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>
					{isAborted
						? "タイムアウトしました"
						: "サーバーに接続できませんでした"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{isAborted
							? "サーバーがスリープしている可能性があるので、50秒ほど時間を空けてお試しください"
							: "ut.code(); のメンバーに問い合わせてください"}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => navigate("/")}>トップに戻る</Button>
				</DialogActions>
			</Dialog>
			{gameState.kyoku <= 4 ? (
				gameState.junme === 19 ? (
					<DrawEnd drawEnd={drawEnd} />
				) : (
					<div className="flex flex-col size-full">
						<div className="h-16">
							<Header
								kyoku={gameState.kyoku}
								junme={gameState.junme}
								playerInfo={props.playerInfo}
								setPlayerInfo={props.setPlayerInfo}
							/>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 w-[70rem] h-[20rem] gap-[0.1rem] mx-auto">
							{gameState.isAgari ? (
								<TsumoEnd tsumoEnd={tsumoEnd} />
							) : (
								<>
									{display === "sutehai" ? (
										<div className="col-1 row-start-1 row-end-3">
											<DisplaySwitch
												display={display}
												setDisplay={setDisplay}
											/>
											<DiscardArea sutehai={gameState.sutehai} />
										</div>
									) : (
										<div className="col-1 row-start-1 row-end-3">
											<DisplaySwitch
												display={display}
												setDisplay={setDisplay}
											/>
											<ValidTiles
												tehai={gameState.tehai}
												tsumo={gameState.tsumo}
											/>
										</div>
									)}
									<div className="col-2 row-1">
										{isLoading ? (
											<HandStatusSkelton />
										) : (
											<HandStatus
												mentsuSyanten={gameState.mentsuSyanten}
												toitsuSyanten={gameState.toitsuSyanten}
											/>
										)}
									</div>
									{isLoading ? (
										<div className="col-2 row-2">
											<WaitingTilesSkeleton />
										</div>
									) : (
										<div className="col-2 row-2">
											<WaitingTiles tehai={gameState.tehai} />
										</div>
									)}
								</>
							)}
						</div>
						<div className="h-24 my-auto">
							{isLoading ? (
								<HandTileSkelton />
							) : (
								<HandTiles
									tehai={gameState.tehai}
									tsumo={gameState.tsumo}
									tedashi={tedashi}
									tsumogiri={tsumogiri}
								/>
							)}
						</div>
					</div>
				)
			) : (
				<FinishGame finishGame={finishGame} />
			)}
		</div>
	);
};

export default GameInterface;
