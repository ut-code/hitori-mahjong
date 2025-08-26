import { Skeleton } from "@mui/material";

export default function HandStatusSkelton() {
	return (
		<>
			<div className="h-full flex flex-col gap-4 rounded-[1rem] shadow-md">
				<div className="pt-4 font-medium pl-4 text-2xl text-left">向聴数</div>
				<div className="font-medium pl-6 text-left text-xl leading-normal w-[80%]">
					<Skeleton variant="text" />
					<Skeleton variant="text" />
				</div>
			</div>
		</>
	);
}
