type HandStatusProps = {
	mentsuSyanten: number;
	toitsuSyanten: number;
};

function HandStatus(props: HandStatusProps) {
	return (
		<div
			style={{
				paddingBottom: "3rem",
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
				{props.mentsuSyanten === 0 ? (
					<>メンツ手: テンパイ</>
				) : (
					<>メンツ手: {props.mentsuSyanten}シャンテン</>
				)}
				<br />
				{props.toitsuSyanten === 0 ? (
					<>七対子: テンパイ</>
				) : (
					<>七対子: {props.toitsuSyanten}シャンテン</>
				)}
			</div>
		</div>
	);
}

export default HandStatus;
