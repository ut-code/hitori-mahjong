import { Height } from "@mui/icons-material";
import { Skeleton } from "@mui/material";

export default function WaitingTilesSkeleton() {
	return (
		<>
			<Skeleton variant="rectangular" />
			<br />
			<Skeleton variant="rectangular" sx={{ height: "40px" }} />
		</>
	);
}
