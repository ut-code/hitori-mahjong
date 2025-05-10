import type React from "react";
import Header from "./components/Header";
import DiscardArea from "./components/DiscardArea";
import HandStatus from "./components/HandStatus";
import WaitingTiles from "./components/WaitingTiles";
import HandTiles from "./components/HandTiles";
import { useState, useEffect } from "react";
import { sortTehai } from "../../utils/hai";
import type { Hai } from "../../utils/hai";
import { useNavigate } from "react-router-dom";
import judgeAgari from "../../utils/judgeAgari";
import DrawEnd from "./components/DrawEnd";
import TsumoEnd from "./components/TsumoEnd";
import FinishGame from "./components/FinishGame";
import calculateSyantenMentsu from "../../utils/calculateSyantenMentsu";
import calculateSyantenToitsu from "../../utils/calculateSyantenToitsu";
import type { PlayerInfo } from "../../App";
import HandTileSkelton from "./components/HandTileSkeleton";
import HandStatusSkelton from "./components/HandStatusSkeleton";
import ValidTiles from "./components/ValidTiles";
import DisplaySwitch from "./components/DisplaySwitch";
import WaitingTilesSkeleton from "./components/WaitingTilesSkeleton";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

export type GameState = {
	kyoku: number;
	junme: number;
};

type GameInterfaceProps = {
	playerInfo: PlayerInfo;
	setPlayerInfo: React.Dispatch<React.SetStateAction<PlayerInfo>>;
};
const GameInterface = (props: GameInterfaceProps) => {
	const navigate = useNavigate();
	const [haiyama, setHaiyama] = useState<Hai[]>([]);
	const [tehai, setTehai] = useState<Hai[]>([]);
	const [tsumo, setTsumo] = useState<Hai>({ kind: "manzu", value: 1 }); //適当な値を設定している
	const [gameState, setGameState] = useState<GameState>({ kyoku: 1, junme: 1 });
	const [isAgari, setIsAgari] = useState(
		judgeAgari(sortTehai([...tehai, tsumo])),
	);
	const [mentsuSyanten, setMentsuSyanten] = useState(13); //適当な初期値を設定
	const [toitsuSyanten, setToitsuSyanten] = useState(6); //適当な初期値を設定
	const [sutehai, setSutehai] = useState<Hai[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [isAborted, setIsAborted] = useState(false);
	const [display, setDisplay] = useState<"sutehai" | "validTiles">("sutehai");
	const apiUrl = import.meta.env.VITE_API_URL;
	console.log(isAgari, gameState.kyoku, gameState.junme);

	useEffect(() => {
		const fetchInitialHaiyama = async () => {
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

				setTehai(sortTehai(data.slice(0, 13)));
				setTsumo(data[13]);
				setHaiyama(data.slice(14));
				setIsLoading(false);
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
		if ((gameState.kyoku <= 4 && gameState.junme === 1) || isAgari) {
			fetchInitialHaiyama();
		}
	}, [isAgari, gameState.junme, gameState.kyoku]);

	useEffect(() => {
		if (gameState.kyoku === 5) {
			const sendResult = () => {
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
				} catch (error) {
					console.error("failed in creating score", error);
				}
			};
			sendResult();
		}
	}, [gameState.kyoku, props.playerInfo.name, props.playerInfo.score]);

	useEffect(() => {
		if (gameState.junme <= 18) {
			setIsAgari(judgeAgari(sortTehai([...tehai, tsumo])));
		}
		setMentsuSyanten(calculateSyantenMentsu(tehai));
		setToitsuSyanten(calculateSyantenToitsu(tehai));
	}, [tehai, tsumo, gameState.junme]);

	const tedashi = (index: number) => {
		setSutehai((sutehai) => [...sutehai, tehai[index]]);
		const newTehai = [...tehai];
		newTehai.splice(index, 1);
		const sortedTehai = sortTehai([...newTehai, tsumo]);
		setTehai(sortedTehai);
		setTsumo(haiyama[0]);
		setHaiyama(haiyama.slice(1));
		setGameState({
			...gameState,
			junme: gameState.junme + 1,
		});
	};

	const tsumogiri = () => {
		setSutehai((sutehai) => [...sutehai, tsumo]);
		setTsumo(haiyama[0]);
		setHaiyama(haiyama.slice(1));
		setGameState({
			...gameState,
			junme: gameState.junme + 1,
		});
	};

	const drawEnd = () => {
		setSutehai([]);
		setGameState({
			junme: 1,
			kyoku: gameState.kyoku + 1,
		});
		setTehai([]);
		const bonusPoint =
			toitsuSyanten === 0 || mentsuSyanten === 0
				? 1000
				: toitsuSyanten === 1 || mentsuSyanten === 1
					? 500
					: 0; //聴牌してたら1000点、イーシャンテンなら500点
		props.setPlayerInfo((prevInfo) => ({
			...prevInfo,
			score: prevInfo.score + bonusPoint,
		}));
	};

	const tsumoEnd = () => {
		setSutehai([]);
		setTehai([]);
		setGameState({
			junme: 1,
			kyoku: gameState.kyoku + 1,
		});
		props.setPlayerInfo({
			...props.playerInfo,
			score: props.playerInfo.score + 8000,
		});
	};

	const finishGame = () => {
		navigate("/result");
	};

	return (
		<div>
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
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							padding: "1rem",
							fontFamily: "Arial, sans-serif",
							minWidth: "80vw",
							minHeight: "80vh",
							gap: "1rem",
							backgroundColor: "white",
							borderRadius: "1rem",
							margin: "0 auto",
						}}
					>
						<Header
							kyoku={gameState.kyoku}
							junme={gameState.junme}
							playerInfo={props.playerInfo}
							setPlayerInfo={props.setPlayerInfo}
						/>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "50% 50%",
								gridTemplateRows: "50% 50%",
								width: "70rem",
								height: "25rem",
								gap: "0.1rem",
							}}
						>
							{isAgari ? (
								<TsumoEnd tsumoEnd={tsumoEnd} />
							) : (
								<>
									{display === "sutehai" ? (
										<span
											style={{
												gridColumn: "1",
												gridRow: "1 / 3",
											}}
										>
											<DisplaySwitch
												display={display}
												setDisplay={setDisplay}
											/>
											<DiscardArea sutehai={sutehai} />
										</span>
									) : (
										<span
											style={{
												gridColumn: "1",
												gridRow: "1 / 3",
											}}
										>
											<DisplaySwitch
												display={display}
												setDisplay={setDisplay}
											/>
											<ValidTiles tehai={tehai} tsumo={tsumo} />
										</span>
									)}
									<span
										style={{
											gridColumn: "2",
											gridRow: "1",
										}}
									>
										{isLoading ? (
											<>
												<HandStatusSkelton />
											</>
										) : (
											<HandStatus
												mentsuSyanten={mentsuSyanten}
												toitsuSyanten={toitsuSyanten}
											/>
										)}
									</span>
									{isLoading ? (
										<>
											<span
												style={{
													gridColumn: "2",
													gridRow: "2",
												}}
											>
												<WaitingTilesSkeleton />
											</span>
										</>
									) : (
										<span
											style={{
												gridColumn: "2",
												gridRow: "2",
											}}
										>
											<WaitingTiles tehai={tehai} />
										</span>
									)}
								</>
							)}
						</div>
						{isLoading ? (
							<HandTileSkelton />
						) : (
							<HandTiles
								tehai={tehai}
								tsumo={tsumo}
								tedashi={tedashi}
								tsumogiri={tsumogiri}
							/>
						)}
					</div>
				)
			) : (
				<FinishGame finishGame={finishGame} />
			)}
		</div>
	);
};

export default GameInterface;
