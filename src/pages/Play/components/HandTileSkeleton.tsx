import { Skeleton } from "@mui/material";

export default function HandTileSkelton() {
	const arr = new Array(14).fill(0);
	return (
		<div>
			<ul>
				{arr.map((_, index) => (
					<li key={index}>
						<Skeleton variant="rectangular" width={50} height={70} />
					</li>
				))}
			</ul>
		</div>
	);
}
