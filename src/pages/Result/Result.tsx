import { useContext, useEffect, useState } from "react";
import { PlayerInfoContext } from "../../App";
import { PlayerInfo } from "../../App";
import { exampleUsers } from "../../utils/exampleUsers";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FaCrown } from "react-icons/fa";
import React from "react";
import { useNavigate } from "react-router-dom";
import RankingTable from "./RankingTable";
import * as styles from "./style";

export default function Result() {
	const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
	const [scores, setScores] = useState<PlayerInfo[]>([]);
	const [myRank, setMyRank] = useState<number | null>(null);
	const [isTop, setIsTop] = useState<boolean>(false);
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;
	useEffect(() => {
		const controller = new AbortController();
		const fetchResult = async () => {
			try {
				const res = await fetch(`${apiUrl}/result`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					mode: "cors",
				});

				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}

				const data = await res.json();

				const sortedScores: PlayerInfo[] = data
					.sort((a: PlayerInfo, b: PlayerInfo) => b.score - a.score)
					.map((player: PlayerInfo, index: number) => ({
						...player,
						rank: index + 1,
					}));
				setScores(sortedScores);

				const myScore = sortedScores.find(
					(player) => player.name === playerInfo.name,
				);
				if (myScore?.rank != null && myScore.rank > 3) {
					//3位以内をsetMyRankするとエラーが返ってくる
					setMyRank(myScore.rank);
				} else if (myScore?.rank != null && myScore.rank <= 3) {
					setIsTop(true);
				}
			} catch (e) {
				console.error("Failed to fetch results:", e);
				// エラーが発生した場合はデフォルトの例を表示
				setScores(exampleUsers);
			}
		};

		fetchResult();
		return () => {
			controller.abort();
		};
	}, []);

	const top1Player: PlayerInfo =
		scores.length > 1 ? scores[0] : exampleUsers[0];
	const top2Player: PlayerInfo =
		scores.length > 2 ? scores[1] : exampleUsers[0];
	const top3Player: PlayerInfo =
		scores.length > 3 ? scores[2] : exampleUsers[0];

	return (
		<div style={styles.containerStyle}>
			<div style={styles.headerStyle}>
				<IconButton
					onClick={() => {
						navigate("/");
						setPlayerInfo(() => ({ rank: null, name: "", score: 25000 }));
					}}
				>
					<HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
				</IconButton>
				<h2 style={styles.headerTitleStyle}>ランキング</h2>
			</div>

			{scores.length !== 0 && (
				<>
					<div style={styles.topRankingStyle}>
						<div style={styles.topRankItemStyle(styles.top2Color)}>
							<div style={styles.topRankNumberStyle(styles.top2Color)}>
								<i>2</i>
							</div>
							<div style={styles.topRankUsernameStyle}>
								<span>{top2Player.name}</span>
							</div>
							<div style={styles.topRankScoreStyle}>
								<i>{top2Player.score}</i>
							</div>
						</div>
						<div
							style={{
								...styles.topRankItemStyle(styles.top1Color),
								height: "130px",
							}}
						>
							<FaCrown style={styles.crownIconStyle(styles.top1Color)} />
							<div style={styles.topRankNumberStyle(styles.top1Color)}>
								<i>1</i>
							</div>
							<div style={styles.topRankUsernameStyle}>{top1Player.name}</div>
							<div style={styles.topRankScoreStyle}>
								<i>{top1Player.score}</i>
							</div>
						</div>
						<div style={styles.topRankItemStyle(styles.top3Color)}>
							<div style={styles.topRankNumberStyle(styles.top3Color)}>
								<i>3</i>
							</div>
							<div style={styles.topRankUsernameStyle}>{top3Player.name}</div>
							<div style={styles.topRankScoreStyle}>
								<i>{top3Player.score}</i>
							</div>
						</div>
					</div>

					<RankingTable
						scores={scores.length > 3 ? scores.slice(3) : []}
						myRank={myRank}
						isTop={isTop}
					/>
				</>
			)}
		</div>
	);
}
