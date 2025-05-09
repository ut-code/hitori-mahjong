import { Skeleton } from "@mui/material";

export default function WaitingTilesSkeleton() {
	return (
		<div
			style={{
				display: "flex",
				gap: "0.5em",
				flexDirection: "column",
				borderRadius: "4px",
				backgroundColor: "white",
				border: "solid",
				boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
				width: "30em",
				height: "7em",
			}}
		>
			<Skeleton
				variant="rectangular"
				sx={{ padding: "0px", width: "5em", height: "2em", marginTop: "0.5em" }}
			/>
			<Skeleton
				variant="rectangular"
				sx={{ height: "4em", marginRight: "3em" }}
			/>
		</div>
	);
}
