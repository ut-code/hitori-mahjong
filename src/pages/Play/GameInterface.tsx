import React from "react";
import styles from "./styles/GameInterface.module.css";
import Header from "./components/Header";
import DiscardArea from "./components/DiscardArea";
import HandStatus from "./components/HandStatus";
import WaitingTiles from "./components/WaitingTiles";
import HandTiles from "./components/HandTiles";
import { useState, useEffect } from "react";
import { sortTehai } from "../../utils/hai";
import { exampleHaiyama } from "../../utils/exampleHaiyama";
import { Hai } from "../../utils/hai";
import { useNavigate } from "react-router-dom";
import judgeAgari from "../../utils/judgeAgari";
import DrawEnd from "./components/DrawEnd";
import TsumoEnd from "./components/TsumoEnd";
import FinishGame from "./components/FinishGame";
import Loading from "./components/Loading";
import calculateSyantenMentsu from "../../utils/calculateSyantenMentsu";
import calculateSyantenToitsu from "../../utils/calculateSyantenToitsu";
import { PlayerInfo } from "../../App";

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
	const [toitsuSyanten, setToitsuSyanten] = useState(2); //適当な初期値を設定
	const [sutehai, setSutehai] = useState<Hai[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const apiUrl = import.meta.env.VITE_API_URL;

	const fetchInitialHaiyama = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${apiUrl}/start`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				mode: "cors",
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();

			// 最初の13枚をtehaiに、その次をtsumoに、残りをhaiyamaにセット
			setTehai(sortTehai(data.slice(0, 13)));
			setTsumo(data[13]);
			setHaiyama(data.slice(14));
			setIsLoading(false);
		} catch (error) {
			setIsLoading(true);
			console.error("Failed to fetch initial haiyama:", error);
			setTehai(sortTehai(exampleHaiyama.slice(0, 13)));
			setTsumo(exampleHaiyama[13]);
			setHaiyama(exampleHaiyama.slice(14));
			//setIsLoading(false);
			throw new Error("Failed to fetch initial haiyama");
		}
	};

	useEffect(() => {
		fetchInitialHaiyama();
	}, []);
	useEffect(() => {
		if (gameState.kyoku === 5) {
			const sendResult = () => {
				fetch(`${apiUrl}/end`, {
					method: "post",
					headers: { "Content-Type": "application/json" },
					mode: "cors",
					body: JSON.stringify({
						name: sessionStorage["name"],
						score: props.playerInfo.score,
					}),
				});
			};
			sendResult();
		}
	}, [gameState.kyoku]);

	useEffect(() => {
		if (gameState.junme <= 18) {
			setIsAgari(judgeAgari(sortTehai([...tehai, tsumo])));
		}
		setMentsuSyanten(calculateSyantenMentsu(tehai));
		setToitsuSyanten(calculateSyantenToitsu(tehai));
	}, [tehai, tsumo]);

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
		fetchInitialHaiyama();
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
		setGameState({
			junme: 1,
			kyoku: gameState.kyoku + 1,
		});
		fetchInitialHaiyama();
		props.setPlayerInfo({
			...props.playerInfo,
			score: props.playerInfo.score + 8000,
		});
	};

	const finishGame = () => {
		navigate("/result");
	};

	return (
		<div className={styles.container}>
			{gameState.kyoku <= 4 ? (
				gameState.junme === 19 ? (
					<DrawEnd drawEnd={drawEnd} />
				) : (
					<div className={styles.container}>
						<Header
							kyoku={gameState.kyoku}
							junme={gameState.junme}
							playerInfo={props.playerInfo}
							setPlayerInfo={props.setPlayerInfo}
						/>
						<div className={styles.gridContainer}>
							{isAgari ? (
								<TsumoEnd tsumoEnd={tsumoEnd} />
							) : (
								<>
									<span className={styles.discardArea}>
										<DiscardArea sutehai={sutehai} />
									</span>
									<span className={styles.handStatus}>
										{isLoading ? (
											<Loading />
										) : (
											<HandStatus
												mentsuSyanten={mentsuSyanten}
												toitsuSyanten={toitsuSyanten}
											/>
										)}
									</span>
									<span className={styles.waitingTiles}>
										<WaitingTiles tehai={tehai} />
									</span>
								</>
							)}
						</div>
						{isLoading ? (
							<Loading />
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
