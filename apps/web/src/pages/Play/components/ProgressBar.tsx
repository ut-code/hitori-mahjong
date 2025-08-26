import { Box } from "@mui/material";

const ProgressBar = ({ progress, label }) => {
	return (
		<Box className="relative w-1/2">
			<Box className="relative w-full h-4 bg-[#e0e0e0] rounded-lg overflow-hidden">
				<Box
					className="h-full"
					style={{
						width: `${progress}%`,
						background: "linear-gradient(to right, #ff9800, #f44336)",
						transition: "width 0.3s ease",
					}}
				/>
			</Box>
			<Box
				className="absolute flex items-center justify-center bg-[#333] text-white px-1.5 py-0.5 text-xs rounded-lg shadow-md whitespace-nowrap"
				style={{
					left: `${progress}%`,
					top: "25px",
					transform: "translateX(-50%)",
				}}
			>
				{/* semicircle above label */}
				<span
					className="absolute"
					style={{
						top: "-4px",
						left: "50%",
						transform: "translateX(-50%)",
						width: "12px",
						height: "6px",
						backgroundColor: "#333",
						borderTopLeftRadius: "6px",
						borderTopRightRadius: "6px",
						display: "block",
					}}
				></span>
				<div className="text-xs text-white relative">{label}</div>
			</Box>
		</Box>
	);
};

export default ProgressBar;
