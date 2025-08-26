import Button from "@mui/material/Button";

type TsumoEndProps = {
	tsumoEnd: () => void;
};

export default function TsumoEnd(props: TsumoEndProps) {
	return (
		<div
			className="flex flex-col items-center justify-center h-[20rem] w-[70rem] mx-auto"
			style={{ transform: "translateY(3rem)" }}
		>
			<div className="text-[8rem] font-extrabold text-red-600">ツモ！</div>
			<Button
				variant="contained"
				onClick={props.tsumoEnd}
				className="w-[8rem] h-[4rem]"
			>
				確認
			</Button>
		</div>
	);
}
