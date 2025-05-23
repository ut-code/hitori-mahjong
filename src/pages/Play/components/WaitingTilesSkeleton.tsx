import { Skeleton } from "@mui/material";

export default function WaitingTilesSkeleton() {
	return (
		<div className="h-full rounded-[1rem] shadow-md">
			<div className="pt-4 pl-4 text-2xl text-left font-medium">待ち</div>
			<div className="pt-4 font-medium pl-6 text-left text-xl leading-normal w-[80%]">
				<Skeleton variant="text" />
			</div>
		</div>
	);
}
