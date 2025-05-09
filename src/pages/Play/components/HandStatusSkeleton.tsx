import { Skeleton } from "@mui/material";

export default function HandStatusSkelton() {
	return (
		<div
			style={{
				paddingBottom: "0px",
				display: "flex",
				flexDirection: "column",
				borderRadius: "4px",
				backgroundColor: "white",
				boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
				width: "30em",
				height: "7em",
			}}
		>
			<Skeleton variant="text" sx={{ height: "3em", marginRight: "10em" }} />
			<Skeleton variant="text" sx={{ height: "3em", marginRight: "4em" }} />
			<Skeleton variant="text" sx={{ height: "3em", marginRight: "4em" }} />
		</div>
	);
}
