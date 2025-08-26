import Button from "@mui/material/Button";

type FinishGameProps = {
	finishGame: () => void;
};
export default function FinishGame(props: FinishGameProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-6">
			<div className="text-3xl font-bold text-white">終局</div>
			<Button
				variant="contained"
				onClick={props.finishGame}
				className="bg-[#fd903c] text-white w-60 h-16 text-lg rounded-md shadow-md"
			>
				結果画面へ
			</Button>
		</div>
	);
}
