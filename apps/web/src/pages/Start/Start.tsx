import { TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PlayerInfo } from "../../App";

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
			<a
				href="https://mf98.utcode.net/"
				className="fixed top-10 left-10 text-lg text-white"
			>
				＜五月祭ホームに戻る
			</a>
			<div className="flex flex-col">
				<div className="text-6xl text-center font-bold text-white">
					一人麻雀
				</div>
				<div className="text-xl text-center text-white">
					～麻雀の基礎は平面にある～
				</div>
			</div>

			<div className="flex flex-col items-center gap-2.5 mt-15">
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
					className="bg-white rounded-md w-115"
				/>

				<button
					onClick={handleUserNameSubmit}
					className="w-115 h-17.5 bg-black text-white text-xl rounded-md my-3.5"
					type="button"
				>
					プレイ
				</button>
				<div className="flex gap-5">
					<button
						onClick={() => navigate("/tutorial")}
						className="w-55 bg-black text-white rounded-md"
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
						className="w-55 bg-black text-white rounded-md"
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
