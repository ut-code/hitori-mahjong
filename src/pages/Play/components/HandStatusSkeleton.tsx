import { Skeleton } from "@mui/material";

export default function HandStatusSkelton() {
	return (
		<>
			<div>
				<div>
					<Skeleton variant="text" />
				</div>
				<div>
					<Skeleton variant="text" />
					<Skeleton variant="text" />
				</div>
			</div>
		</>
	);
}
