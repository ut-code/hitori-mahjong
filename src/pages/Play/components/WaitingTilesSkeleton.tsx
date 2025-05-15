import { Height } from "@mui/icons-material";
import { Skeleton } from "@mui/material";

export default function WaitingTilesSkeleton() {
	return (
		<div
			style={{
				height: "100%",
				borderRadius: "1rem",
				boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
			}}
		>
			<div
				style={{
					paddingTop: "0.5rem",
					paddingLeft: "1rem",
					fontSize: "1.5rem",
					textAlign: "left",
					fontWeight: "500",
				}}
			>
				待ち
			</div>
			<div
				style={{
					paddingTop: "1rem",
					fontWeight: "500",
					paddingLeft: "1.5rem",
					textAlign: "left",
					fontSize: "1.3rem",
					lineHeight: "1.5",
					width: "80%",
				}}
			>
				<Skeleton variant="text" />
			</div>
		</div>
	);
}
