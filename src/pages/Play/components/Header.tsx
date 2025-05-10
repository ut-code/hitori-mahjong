import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import { PlayerInfo } from "../../../App";
import ProgressBar from "./ProgressBar";

type HeaderProps = {
	kyoku: number;
	junme: number;
	playerInfo: PlayerInfo;
	setPlayerInfo: React.Dispatch<React.SetStateAction<PlayerInfo>>;
};

function Header(props: HeaderProps) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false); // State to control dialog visibility
	const progress = (props.junme / 18) * 100;

	const handleOpenDialog = () => {
		setOpen(true);
	};

	const handleCloseDialog = () => {
		setOpen(false);
	};

	const handleConfirm = () => {
		setOpen(false);
		navigate("/");
		props.setPlayerInfo(() => ({ rank: null, name: "", score: 25000 }));
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				width: "100%",
			}}
		>
			<IconButton onClick={handleOpenDialog}>
				<HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
			</IconButton>

			<div
				style={{
					fontSize: "2em",
					fontWeight: "bold",
				}}
			>
				東風戦 東{props.kyoku}局 {props.playerInfo.score}点
			</div>
			<ProgressBar progress={progress} label={`${props.junme}巡目`} />

			{/* Confirmation Dialog */}
			<Dialog
				open={open}
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						遊んだデータが失われますが、スタート画面に戻りますか？
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						キャンセル
					</Button>
					<Button onClick={handleConfirm} color="primary" autoFocus>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default Header;
