import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import type { PlayerInfo } from "../../App";
import { exampleUsers } from "../../utils/exampleUsers";
import RankingTable from "./RankingTable";
import * as styles from "./style";

type ResultProps = {
	playerInfo: PlayerInfo;
};

export default function Result(props: ResultProps) {
	const [scores, setScores] = useState<PlayerInfo[]>([]);
	const [myRank, setMyRank] = useState<number | null>(null);
	const [open, setOpen] = useState(false);
	const [isAborted, setIsAborted] = useState(false);
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const UserSchema = z.object({
			id: z.number(),
			name: z.string(),
			score: z.number(),
		});

		const UserArray = UserSchema.array();
		const fetchResult = async () => {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 5000);
			try {
				const res = await fetch(`${apiUrl}/scores`, {
					method: "GET",
					mode: "cors",
					signal: controller.signal,
				});

				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}

				const data: PlayerInfo[] = await res.json();

				const result = UserArray.safeParse(data);

				if (!result.success) {
					console.error("Error: ", result.error.issues);
					return;
				}

				if (
					props.playerInfo.rank !== null &&
					!data.some((player) => player.name === props.playerInfo.name)
				) {
					data.push(props.playerInfo);
				}

				const sortedScores: PlayerInfo[] = data
					.sort((a: PlayerInfo, b: PlayerInfo) => b.score - a.score)
					.map((player: PlayerInfo, index: number) => ({
						...player,
						rank: index + 1,
					}));

				if (sortedScores.length < 4) {
					setScores([...sortedScores, ...exampleUsers]);
				} else {
					setScores(sortedScores);
				}

				const myScore = sortedScores.find(
					(player) => player.name === props.playerInfo.name,
				);
				if (typeof myScore === "undefined") {
					setMyRank(null); // ルートから直接とんだ場合
				} else {
					setMyRank(myScore.rank);
				}
			} catch (e) {
				if (e instanceof DOMException && e.name === "AbortError") {
					setIsAborted(true);
				}
				console.error("failed in getting results:", e);
				setOpen(true);
			} finally {
				clearTimeout(timeout);
			}
		};

		fetchResult();
	}, [props.playerInfo]);

	const top1Player: PlayerInfo =
		scores.length > 1 ? scores[0] : exampleUsers[0];
	const top2Player: PlayerInfo =
		scores.length > 2 ? scores[1] : exampleUsers[1];
	const top3Player: PlayerInfo =
		scores.length > 3 ? scores[2] : exampleUsers[2];

	return (
		<div style={styles.containerStyle}>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>
					{isAborted
						? "タイムアウトしました"
						: "データベースに接続できませんでした"}{" "}
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
			<div style={styles.headerStyle}>
				<IconButton
					onClick={() => {
						navigate("/");
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
