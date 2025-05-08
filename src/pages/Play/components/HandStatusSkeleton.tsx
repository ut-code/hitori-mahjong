import { Skeleton } from "@mui/material";

export default function HandStatusSkelton() {
	return (
		<div
			style={{
				paddingBottom: "20px",
				display: "flex",
				flexDirection: "column",
				borderRadius: "4px",
				backgroundColor: "white",
				boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
				width: "30em",
				height: "100px",
			}}
		>
			<Skeleton variant="text" sx={{ height: "5em" }} />
			<Skeleton variant="text" sx={{ height: "10em" }} />
			<Skeleton variant="text" sx={{ height: "10em" }} />
		</div>
	);
}
