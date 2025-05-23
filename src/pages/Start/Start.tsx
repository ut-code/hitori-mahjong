import { TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PlayerInfo } from "../../App";
import styles from "../../styles/Start.module.css";

type StartProps = {
	setPlayerInfo: React.Dispatch<React.SetStateAction<PlayerInfo>>;
};

export default function Start(props: StartProps) {
	const [inputText, setInputText] = useState("");
	const [invalidReason, setInvalidReason] = useState<null | string>(null);
	const navigate = useNavigate();

	const handleUserNameSubmit = () => {
		const trimmedInput = inputText.trim();

		if (trimmedInput === "") {
			setInvalidReason("ユーザー名を入力してください");
			return;
		}
		if (trimmedInput.length > 20) {
			setInvalidReason("名前は 20 文字以下である必要があります");
			return;
		}
		props.setPlayerInfo((prevInfo) => ({
			...prevInfo,
			name: trimmedInput,
		}));

		navigate("/play");
	};

	return (
		<>
			<a href="https://mf98.utcode.net/" className={styles.home}>
				＜五月祭ホームに戻る
			</a>
			<div className={styles.titleContainer}>
				<div className={styles.mainTitle}>一人麻雀</div>
				<div className={styles.subTitle}>～麻雀の基礎は平面にある～</div>
			</div>

			<div className={styles.formContainer}>
				<TextField
					label="ユーザーネーム"
					variant="filled"
					required={true}
					slotProps={{
						htmlInput: {
							maxLength: 20,
						},
					}}
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					placeholder="ユーザー名を入力"
					autoComplete="off"
					className={styles.textField}
				/>

				<button
					onClick={handleUserNameSubmit}
					className={styles.playButton}
					type="button"
				>
					プレイ
				</button>
				<div className={styles.buttonContainer}>
					<button
						onClick={() => navigate("/tutorial")}
						className={styles.grayButton}
						type="button"
					>
						遊び方
					</button>
					<button
						onClick={() => {
							props.setPlayerInfo({
								rank: null,
								name: "",
								score: 25000,
							});
							navigate("/result");
						}}
						className={styles.grayButton}
						type="button"
					>
						ランキング
					</button>
				</div>

				{invalidReason && <Alert severity="error">{invalidReason}</Alert>}
			</div>
		</>
	);
}
