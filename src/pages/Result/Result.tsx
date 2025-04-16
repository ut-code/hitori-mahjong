import { useContext, useEffect, useState } from "react";
import { PlayerInfoContext, PlayerInfo } from "../../App";
import { exampleUsers } from "../../utils/exampleUsers";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RankingTable from "./RankingTable";
import * as styles from "./style";
import { z } from "zod";

export default function Result() {
	const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
	const [scores, setScores] = useState<PlayerInfo[]>([]);
	const [myRank, setMyRank] = useState<number | null>(null); // ルートから直接飛んだ場合は null のまま
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;

	const UserSchema = z.object({
		id: z.number(),
		name: z.string(),
		score: z.number(),
	});

	const UserArray = UserSchema.array();

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

				const result = UserArray.safeParse(data);

				if (!result.success) {
					console.error("Error: ", result.error.issues);
				}

				const sortedScores: PlayerInfo[] = data
					.sort((a: PlayerInfo, b: PlayerInfo) => b.score - a.score)
					.map((player: PlayerInfo, index: number) => ({
						...player,
						rank: index + 1,
					}));
				setScores(sortedScores);
				if (sortedScores.length < 3) {
					setScores([...scores, ...exampleUsers]);
				}

				const myScore = sortedScores.find(
					(player) => player.name === playerInfo.name,
				);

				if (myScore?.rank != null) {
					setMyRank(myScore.rank);
				}
			} catch (e) {
				console.error("Failed to fetch results:", e);
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
		scores.length > 2 ? scores[1] : exampleUsers[1];
	const top3Player: PlayerInfo =
		scores.length > 3 ? scores[2] : exampleUsers[2];

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
					/>
				</>
			)}
		</div>
	);
}
