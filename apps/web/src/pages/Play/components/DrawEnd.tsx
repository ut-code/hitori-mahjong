import Button from "@mui/material/Button";

type DrawEndProps = {
	drawEnd: () => void;
};
export default function DrawEnd(props: DrawEndProps) {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="mt-2 mb-5 text-[80px]">流局</div>
			<Button
				variant="contained"
				onClick={props.drawEnd}
				className="w-fit h-16 text-lg bg-[#fd903c] text-white rounded-md shadow-md"
			>
				確認
			</Button>
		</div>
	);
}
