import Button from "@mui/material/Button";

type FinishGameProps = {
	finishGame: () => void;
};
export default function FinishGame(props: FinishGameProps) {
	return (
		<div className="justify-center">
			<div className="mt-2.5 text-[80px] mb-5">終局</div>
			<Button
				variant="contained"
				onClick={props.finishGame}
				className="w-max h-1/5"
			>
				結果画面へ
			</Button>
		</div>
	);
}
