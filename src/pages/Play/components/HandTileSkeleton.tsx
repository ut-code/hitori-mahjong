import { Skeleton } from "@mui/material";

export default function HandTileSkelton() {
	const arr = new Array(14).fill(0).map((value, index) => {
		return value + index;
	});

	return (
		<div>
			<ul style={{
				padding: "0",
				display: "flex",
				listStyleType: "none",
				justifyContent: "center",
			}}>
				{arr.map((value) => (
					<li key={value}>
						<Skeleton variant="rectangular" width={50} height={70} />
					</li>
				))}
			</ul>
		</div>
	);
}
