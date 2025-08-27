import { Box } from "@mui/material";

const ProgressBar = ({
	progress,
	label,
}: {
	progress: number;
	label: string;
}) => {
	return (
		<Box className="relative w-1/2">
			<Box className="relative w-full h-4 bg-[#e0e0e0] rounded-lg overflow-hidden">
				<Box
					className="h-full bg-gradient-to-r from-[#ff9800] to-[#f44336] transition-width duration-300 ease-in-out"
					style={{ width: `${progress}%` }}
				/>
			</Box>
			<Box
				className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#333] text-white px-1.5 py-0.5 text-xs rounded-lg shadow-md whitespace-nowrap"
				style={{ left: `${progress}%` }}
			>
				{label}
				<div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-3 h-1.5 bg-[#333] rounded-t-full" />
			</Box>
		</Box>
	);
};

export default ProgressBar;
