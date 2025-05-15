import { Skeleton } from "@mui/material";

export default function HandStatusSkelton() {
	return (
		<>

			<div
				style={{
					height: "100%",
					display: "flex",
					gap: "1rem",
					flexDirection: "column",
					borderRadius: "1rem",
					backgroundColor: "white",
					boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
				}}
			>
				<div
					style={{
						paddingTop: "1rem",
						fontWeight: "500",
						paddingLeft: "1rem",
						fontSize: "1.5rem",
						textAlign: "left",
					}}
				>
					向聴数
				</div>
				<div
					style={{
						fontWeight: "500",
						paddingLeft: "1.5rem",
						textAlign: "left",
						fontSize: "1.3rem",
						lineHeight: "1.5",
					}}
				>
					<Skeleton variant="text" />
					<br />
					<Skeleton variant="text" />
				</div>
			</div>
		</>
	);
}
